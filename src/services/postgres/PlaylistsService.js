const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const AuthorizationError = require('../../exceptions/AuthorizationError')
// const { mapDBToModel } = require('../../utils')

class PlaylistsService {
  constructor (collaborationService, cacheService) {
    this._pool = new Pool()
    this._collaborationService = collaborationService
    this._cacheService = cacheService
  }

  async addPlaylist ({ name, owner }) {
    const id = `playlist-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO tblplaylists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getPlaylists (owner) {
    const query = {
      text: `SELECT tblplaylists.*, tblusers.username FROM tblplaylists
      LEFT JOIN tblusers ON tblusers.id = tblplaylists.owner
    WHERE tblplaylists.owner = $1`,
      values: [owner]
    }
    const result = await this._pool.query(query)
    return result.rows.map((res) => ({
      id: res.id,
      name: res.name,
      username: res.username
    }))
  }

  async verifyPlaylistOwner (id, owner) {
    const query = {
      text: 'SELECT owner FROM tblplaylists WHERE id = $1',
      values: [id]
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Playlist yang anda cari tidak ada')
    }
    const playlist = result.rows[0]
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses playlist ini')
    }
  }

  async addMusicToPlaylist (idplaylist, idsong, owner) {
    const id = nanoid(16)

    const query = {
      text: `INSERT INTO tblplaylistsongs 
      VALUES($1, $2, $3) RETURNING id`,
      values: [id, idplaylist, idsong]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke Playlist')
    }

    await this._cacheService.delete(`playlists:${idplaylist}`)

    return result.rows[0].id
  }

  async getSongsFromPlaylist (id) {
    try {
      const result = await this._cacheService.get(`playlists:${id}`)
      return JSON.parse(result)
    } catch (error) {
      const query = {
        text: `SELECT * FROM tblplaylistsongs JOIN tblsongs ON tblsongs.id = tblplaylistsongs.song_id
        WHERE tblplaylistsongs.playlist_id = $1`,
        values: [id]
      }
      const result = await this._pool.query(query)

      const mappedResult = result.rows.map((res) => ({
        id: res.id,
        title: res.title,
        performer: res.performer
      }))

      await this._cacheService.set(`playlists:${id}`, JSON.stringify(mappedResult))

      return mappedResult
    }
  }

  async verifyPlaylistAccess (id, owner) {
    const query = {
      text: 'SELECT tblplaylists.id FROM tblplaylists INNER JOIN tblusers ON tblplaylists.owner = tblusers.id LEFT JOIN tblcollaborations ON tblcollaborations.playlist_id = tblplaylists.id WHERE (tblplaylists.owner = $2 OR tblcollaborations.user_id = $2) AND tblplaylists.id =$1',
      values: [id, owner]
    }
    const result = await this._pool.query(query)
    if (!result.rows[0]) {
      throw new AuthorizationError('Anda bukan Kolaborator playlist ini')
    }
  }

  async getPlaylistsByUser (owner) {
    const query = {
      text: 'SELECT tblplaylists.id, tblplaylists.name, tblusers.username FROM tblplaylists INNER JOIN tblusers ON tblplaylists.owner = tblusers.id LEFT JOIN tblcollaborations ON tblcollaborations.playlist_id = tblplaylists.id WHERE tblplaylists.owner= $1 OR tblcollaborations.user_id = $1',
      values: [owner]
    }

    const result = await this._pool.query(query)
    return result.rows
  }

  async deleteSongsFromPlaylistbyId (pid, sid) {
    const query = {
      text: 'DELETE FROM tblplaylistsongs WHERE song_id = $2 AND playlist_id = $1 RETURNING id',
      values: [pid, sid]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dihapus. lagu tidak ditemukan pada playlist')
    }

    await this._cacheService.delete(`playlists:${pid}`)
  }

  async deletePlaylistbyId (pid, sid) {
    const query = {
      text: 'DELETE FROM tblplaylists WHERE id = $1 RETURNING id',
      values: [pid]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal dihapus. Mungkin memang sudah terhapus.')
    }
  }
}

module.exports = PlaylistsService

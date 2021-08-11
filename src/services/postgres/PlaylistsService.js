const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const AuthorizationError = require('../../exceptions/AuthorizationError')
// const { mapDBToModel } = require('../../utils')

class PlaylistsService {
  constructor (collaborationService) {
    this._pool = new Pool()
    this._collaborationService = collaborationService
  }

  async addPlaylist ({
    name, owner
  }) {
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

  async addMusicToPlaylist (idplaylist, idsong) {
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

    return result.rows[0].id
  }

  async getSongsFromPlaylist (id) {
    const query = {
      text: `SELECT * FROM tblplaylistsongs JOIN tblmusik ON tblmusik.id = tblplaylistsongs.song_id
    WHERE tblplaylistsongs.playlist_id = $1`,
      values: [id]
    }
    const result = await this._pool.query(query)
    return result.rows.map((res) => ({
      id: res.id,
      title: res.title,
      performer: res.performer
    }))
  }

  async verifyPlaylistAccess (id, owner) {
    const query = {
      text: `
        SELECT * FROM tblplaylists LEFT JOIN tblusers ON tblusers.id = tblplaylists.owner WHERE 
        tblplaylists.id = $1`,
      values: [id]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan (Mungkin sudah terhapus')
    }
    const note = result.rows[0]
    if (note.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses playlist ini')
    }
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

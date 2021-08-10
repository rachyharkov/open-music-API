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

  // async getPlaylistsById (id) {
  //   const query = {
  //     text: `SELECT tblplaylists.*, tblusers.username
  //   FROM tblplaylists
  //   LEFT JOIN tblusers ON tblusers.id = notes.owner
  //   WHERE notes.id = $1`,
  //     values: [id]
  //   }
  //   const result = await this._pool.query(query)

  //   if (!result.rows.length) {
  //     throw new NotFoundError('Catatan tidak ditemukan')
  //   }

  //   return result.rows.map(mapDBToModel)[0]
  // }

  async addMusicToPlaylist (idplaylist, idsong) {
    const id = nanoid(16)

    console.log(`${id}-${idplaylist}-${idsong}`)

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
  // async editNoteById (id, { title, body, tags }) {
  //   const updatedAt = new Date().toISOString()
  //   const query = {
  //     text: 'UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id',
  //     values: [title, body, tags, updatedAt, id]
  //   }

  //   const result = await this._pool.query(query)

  //   if (!result.rows.length) {
  //     throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan')
  //   }
  // }

  // async deleteNoteById (id) {
  //   const query = {
  //     text: 'DELETE FROM notes WHERE id = $1 RETURNING id',
  //     values: [id]
  //   }

  //   const result = await this._pool.query(query)

  //   if (!result.rows.length) {
  //     throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan')
  //   }
  // }

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

  // async verifyNoteAccess (noteId, userId) {
  //   try {
  //     await this.verifyNoteOwner(noteId, userId)
  //   } catch (error) {
  //     if (error instanceof NotFoundError) {
  //       throw error
  //     }
  //     try {
  //       await this._collaborationService.verifyCollaborator(noteId, userId)
  //     } catch {
  //       throw error
  //     }
  //   }
  // }

  // async getUsersByUsername (username) {
  //   const query = {
  //     text: 'SELECT id, username, fullname FROM users WHERE username LIKE $1',
  //     values: [`%${username}%`]
  //   }
  //   const result = await this._pool.query(query)
  //   return result.rows
  // }
}

module.exports = PlaylistsService

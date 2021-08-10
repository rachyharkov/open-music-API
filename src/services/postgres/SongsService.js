const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const { mapDBToModel } = require('../../utils')

class OpenMusicService {
  constructor () {
    this._pool = new Pool()
  }

  async addMusic ({ title, year, performer, genre, duration }) {
    const id = `song-${nanoid(16)}`
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

    const query = {
      text: 'INSERT INTO tblmusik VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [id, title, year, performer, genre, duration, insertedAt, updatedAt]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Musik gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getAllMusic () {
    const result = await this._pool.query('SELECT * FROM tblmusik')
    return result.rows.map(mapDBToModel)
  }

  async getMusicById (id) {
    const query = {
      text: 'SELECT * FROM tblmusik WHERE id = $1',
      values: [id]
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ada, coba masukan lagu favoritmu ke daftar.')
    }

    return result.rows.map(mapDBToModel)[0]
  }

  async editMusicById (id, { title, year, performer, genre, duration }) {
    const updatedAt = new Date().toISOString()
    const query = {
      text: 'UPDATE tblmusik SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, updatedAt, id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui data musik. Id tidak ditemukan')
    }
  }

  async deleteMusicById (id) {
    const query = {
      text: 'DELETE FROM tblmusik WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus karena Id tidak ditemukan')
    }
  }
}

module.exports = OpenMusicService
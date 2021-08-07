const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
// const NotFoundError = require('../../exceptions/NotFoundError')
// const { mapDBToModel } = require('../../utils')

class OpenMusicService {
  constructor () {
    this._pool = new Pool()
  }

  async addMusic ({ title, year, performer, genre, duration }) {
    const id = `song-${nanoid(16)}`
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const query = {
      text: 'INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [id, title, year, performer, genre, duration, createdAt, updatedAt]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Musik gagal ditambahkan')
    }

    return result.rows[0].id
  }
}

module.exports = OpenMusicService

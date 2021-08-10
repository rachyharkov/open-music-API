/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('tblplaylists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    name: {
      type: 'TEXT',
      notNull: true
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('tblplaylists')
}

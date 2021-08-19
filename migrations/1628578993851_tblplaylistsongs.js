/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('tblplaylistsongs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('tblplaylistsongs')
}

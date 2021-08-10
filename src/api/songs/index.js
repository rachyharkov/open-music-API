const MusicDataHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'Songs',
  version: '2.0.0',
  register: async (server, { service, validator }) => {
    const musicDataHandler = new MusicDataHandler(service, validator)
    server.route(routes(musicDataHandler))
  }
}

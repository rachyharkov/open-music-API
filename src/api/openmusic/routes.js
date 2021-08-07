const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postMusicDataHandler
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getAllMusicDataHandler
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getMusicDataByIdHandler
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.putMusicDataByIdHandler
  }
]

module.exports = routes

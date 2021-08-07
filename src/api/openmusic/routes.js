const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postMusicDataHandler
  }
]

module.exports = routes

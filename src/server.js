require('dotenv').config()

const Hapi = require('@hapi/hapi')

// OpenMusic Core
const openmusic = require('./api/openmusic')
const OpenMusicService = require('./services/postgres/OpenMusicService')
const OpenMusicDataValidator = require('./validator/openmusic')

// Users Core
const users = require('./api/users')
const UsersService = require('./services/postgres/UsersService')
const UsersValidator = require('./validator/users')

const init = async () => {
  const openMusicService = new OpenMusicService()

  const usersService = new UsersService()

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register([
    {
      plugin: openmusic,
      options: {
        service: openMusicService,
        validator: OpenMusicDataValidator
      }
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator
      }
    }
  ])

  await server.start()
  console.log(`Server running at ${server.info.uri}, wish u luck m8`)
}

init()

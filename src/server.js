require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')

// OpenMusic Core
const songs = require('./api/songs')
const SongsService = require('./services/postgres/SongsService')
const SongsDataValidator = require('./validator/songs')

// Users Core
const users = require('./api/users')
const UsersService = require('./services/postgres/UsersService')
const UsersValidator = require('./validator/users')

// authentications
const authentications = require('./api/authentications')
const AuthenticationsService = require('./services/postgres/AuthenticationsService')
const TokenManager = require('./tokenize/TokenManager')
const AuthenticationsValidator = require('./validator/authentications')

// Playlist Core
const playlists = require('./api/playlists')
const PlaylistService = require('./services/postgres/PlaylistsService')
const PlaylistsValidator = require('./validator/playlists')

const init = async () => { 
  const playlistsService = new PlaylistService()
  const songsService = new SongsService()
  const usersService = new UsersService()
  const authenticationsService = new AuthenticationsService()

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
      plugin: Jwt
    }
  ])

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
  })

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsDataValidator
      }
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator
      }
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator
      }
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator
      }
    }
  ])

  await server.start()
  console.log(`Server running at ${server.info.uri}, wish u luck m8`)
}

init()

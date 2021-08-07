require('dotenv').config();

const Hapi = require('@hapi/hapi');
const openmusic = require('./api/openmusic');
const OpenMusicService = require('./services/postgres/OpenMusicService');
const OpenMusicDataValidator = require('./validator/openmusic');

const init = async () => {
  const openMusicService = new OpenMusicService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: openmusic,
    options: {
      service: openMusicService,
      validator: OpenMusicDataValidator,
    },
  });

  await server.start();
  console.log(`Server running at ${server.info.uri}, wish u luck m8`);
};

init();

const ClientError = require('../../exceptions/ClientError')

class MusicDataHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postMusicDataHandler = this.postMusicDataHandler.bind(this);
  }

  async postMusicDataHandler(request, h) {
    try {
      this._validator.validateDataPayload(request.payload);
      const { title, year, performer, genre, duration } = request.payload;

      const songId = await this._service.addMusicData({ title, year, performer, genre, duration });

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = MusicDataHandler
class ExportsHandler {
  constructor (ProducerService, playlistsServices, validator) {
    this._ProducerService = ProducerService
    this._playlistsServices = playlistsServices
    this._validator = validator

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this)
  }

  async postExportPlaylistHandler (request, h) {
    try {
      const { id: credentialId } = request.auth.credentials
      const { playlistId } = request.params
      this._validator.validateExportPlaylistsPayload(request.payload)

      await this._playlistsServices.verifyPlaylistAccess(playlistId, credentialId)

      const message = {
        userId: request.auth.credentials.id,
        targetEmail: request.payload.targetEmail
      }

      await this._ProducerService.sendMessage('export:playlist', JSON.stringify(message))

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses'
      })
      response.code(201)
      return response
    } catch (error) {
      if (error) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }
}

module.exports = ExportsHandler

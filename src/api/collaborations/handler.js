class CollaborationsHandler {
  constructor (collaborationsService, playlistsServices) {
    this._collaborationsService = collaborationsService
    this._playlistsServices = playlistsServices

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this)
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this)
  }

  async postCollaborationHandler (request, h) {
    try {
      const { id: credentialId } = request.auth.credentials
      const { playlistId, userId } = request.payload

      await this._playlistsServices.verifyPlaylistAccess(playlistId, credentialId)
      const collaborationId =
        await this._collaborationsService.addCollaboration(playlistId, userId)

      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationId
        }
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

  async deleteCollaborationHandler (request, h) {
    try {
      const { id: credentialId } = request.auth.credentials
      const { playlistId, userId } = request.payload

      await this._playlistsServices.verifyPlaylistAccess(playlistId, credentialId)
      await this._collaborationsService.deleteCollaboration(playlistId, userId)

      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus'
      }
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

module.exports = CollaborationsHandler

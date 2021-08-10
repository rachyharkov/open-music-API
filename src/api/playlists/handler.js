const ClientError = require('../../exceptions/ClientError')

class PlaylistsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this)
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this)
    this.addSongsToPlaylistHandler = this.addSongsToPlaylistHandler.bind(this)
    // this.getPlaylistByIdHandler = this.getPlaylistByIdHandler.bind(this)
    // this.putPlaylistByIdHandler = this.putPlaylistByIdHandler.bind(this)
    // this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this)
    this.getUsersByUsernameHandler = this.getUsersByUsernameHandler.bind(this)
  }

  async postPlaylistHandler (request, h) {
    try {
      this._validator.validatePlaylistsPayload(request.payload)
      const { name } = request.payload
      const { id: credentialId } = request.auth.credentials

      const playlistId = await this._service.addPlaylist({
        name, owner: credentialId
      })

      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId
        }
      })
      response.code(201)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
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

  async getPlaylistsHandler (request) {
    const { id: credentialId } = request.auth.credentials
    const playlists = await this._service.getPlaylists(credentialId)
    return {
      status: 'success',
      data: {
        playlists
      }
    }
  }

  async addSongsToPlaylistHandler (request, h) {
    try {
      // this._validator.validatePlaylistsPayload(request.payload)

      const playlistId = request.params.playlistId
      const { songId } = request.payload
      const { id: credentialId } = request.auth.credentials

      console.log(`${playlistId}-${songId}`)

      await this._service.verifyPlaylistAccess(playlistId, credentialId)
      await this._service.addMusicToPlaylist(playlistId, { song_id: songId })
      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist'
      })
      response.code(201)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
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

  // async getPlaylistByIdHandler (request, h) {
  //   try {
  //     const { id } = request.params
  //     const { id: credentialId } = request.auth.credentials

  //     await this._service.verifyPlaylistAccess(id, credentialId)
  //     const note = await this._service.getNoteById(id)
  //     return {
  //       status: 'success',
  //       data: {
  //         note
  //       }
  //     }
  //   } catch (error) {
  //     if (error instanceof ClientError) {
  //       const response = h.response({
  //         status: 'fail',
  //         message: error.message
  //       })
  //       response.code(error.statusCode)
  //       return response
  //     }

  //     // Server ERROR!
  //     const response = h.response({
  //       status: 'error',
  //       message: 'Maaf, terjadi kegagalan pada server kami.'
  //     })
  //     response.code(500)
  //     console.error(error)
  //     return response
  //   }
  // }

  // async putPlaylistByIdHandler (request, h) {
  //   try {
  //     this._validator.validatePlaylistPayload(request.payload)
  //     const { id } = request.params; const { id: credentialId } = request.auth.credentials

  //     await this._service.verifyPlaylistAccess(id, credentialId)
  //     await this._service.editNoteById(id, request.payload)

  //     return {
  //       status: 'success',
  //       message: 'Catatan berhasil diperbarui'
  //     }
  //   } catch (error) {
  //     if (error instanceof ClientError) {
  //       const response = h.response({
  //         status: 'fail',
  //         message: error.message
  //       })
  //       response.code(error.statusCode)
  //       return response
  //     }

  //     // Server ERROR!
  //     const response = h.response({
  //       status: 'error',
  //       message: 'Maaf, terjadi kegagalan pada server kami.'
  //     })
  //     response.code(500)
  //     console.error(error)
  //     return response
  //   }
  // }

  // async deletePlaylistByIdHandler (request, h) {
  //   try {
  //     const { id } = request.params
  //     const { id: credentialId } = request.auth.credentials

  //     await this._service.verifyNoteOwner(id, credentialId)
  //     await this._service.deleteNoteById(id)

  //     return {
  //       status: 'success',
  //       message: 'Catatan berhasil dihapus'
  //     }
  //   } catch (error) {
  //     if (error instanceof ClientError) {
  //       const response = h.response({
  //         status: 'fail',
  //         message: error.message
  //       })
  //       response.code(error.statusCode)
  //       return response
  //     }

  //     // Server ERROR!
  //     const response = h.response({
  //       status: 'error',
  //       message: 'Maaf, terjadi kegagalan pada server kami.'
  //     })
  //     response.code(500)
  //     console.error(error)
  //     return response
  //   }
  // }

  async getUsersByUsernameHandler (request, h) {
    try {
      const { username = '' } = request.query
      const users = await this._service.getUsersByUsername(username)
      return {
        status: 'success',
        data: {
          users
        }
      }
    } catch (error) {
      if (error instanceof ClientError) {
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

module.exports = PlaylistsHandler

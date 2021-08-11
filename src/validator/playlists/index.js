const InvariantError = require('../../exceptions/InvariantError')
const { PostPlaylistPayloadSchema, PostSongToPlaylistPayloadSchema } = require('./schema')

const PlaylistsValidator = {
  validatePlaylistsPayload: (payload) => {
    const validationResult = PostPlaylistPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validateSongsToPlaylistsPayload: (payload) => {
    const validationResult = PostSongToPlaylistPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = PlaylistsValidator

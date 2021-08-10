const InvariantError = require('../../exceptions/InvariantError')
const { OpenMusicPayloadSchema } = require('./schema')

const OpenMusicDataValidator = {
  validateDataPayload: (payload) => {
    const validationResult = OpenMusicPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = OpenMusicDataValidator

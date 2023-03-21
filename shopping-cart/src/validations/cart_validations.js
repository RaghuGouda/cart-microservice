const Joi = require('joi')

const cart_validations = {
    cart_payload: Joi.object({
                productId: Joi.number().required(),
                quantity: Joi.number().required(),
                name: Joi.string().required(),
                price: Joi.number().required(),        
      })
}
module.exports = cart_validations
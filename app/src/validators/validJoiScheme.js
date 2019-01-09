const Joi = require('joi')

module.exports = function validJoiScheme(scheme, validationElement){
    return (req, res)=>{
        const validation = Joi.validate(req[validationElement], scheme)
        if (validation.error){
            return validation.error.details.map(d=>d.message)
        }
    }
}
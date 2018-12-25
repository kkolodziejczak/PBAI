const Joi = require('joi')
    , config = require('../config')

const login = Joi.string().alphanum().min(3).max(30)

const password = Joi.string().regex(/^[a-zA-Z0-9]{3,40}$/).required()

const id = Joi

exports.login = login.required()

exports.loginNotRequired = login

exports.password = password.required() 

exports.passwordNotRequired = password

exports.password_confirmation = Joi.any().valid(Joi.ref('password')).required()
    .options({language:{any:{allowOnly: 'passwords do not match'}}})

exports.isAdmin = Joi.string()

exports.documentContent = Joi.string().base64().required()

exports.documentName = Joi.string().min(2).max(20).required()

exports.id = id.required()

exports.idNotRequied = id

exports.sec = Joi.number().positive().integer().max(config.MAX_TIMER_SEC).required()

exports.publicKey = Joi.string().min(5).required()

exports.crypted = Joi.string().min(3).required()
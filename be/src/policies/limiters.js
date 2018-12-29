const RateLimit = require('express-rate-limit')
    , config = require('../config')

const handler = _limiter => function limiter(req, res, next){
    return config.LIMITER ? _limiter(req, res, next) : next()
}

module.exports = {
    global: handler(new RateLimit({
        windowMs: 5*60*1000, 
        max: 200,
        delayMs: 0
    }))
}
const log = require('../helpers/log')
    , config = require('../config')

const logger = function logger(req, res, next) {
    req.session.logger = (...logs) => log.info(
        ` -- ${req.user 
            ? `user: id: ${req.user._id}) login: ${req.user.login}` 
            : `ip: (${req.ip})`
        } --`
        , ...logs
    )
    req.session.logger(`(${req.session.id}) ${req.method}: ${req.url}`)
    if (config.LOG_BODY){
        Object.keys(req.body).length && req.session.logger('body:', req.body)
        Object.keys(req.params).length && req.session.logger('params:', req.params)
        Object.keys(req.query).length && req.session.logger('query:', req.query)
    }
    return next()
}

module.exports = logger
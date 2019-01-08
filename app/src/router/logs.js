const crateRouter = require('../helpers/createRouter')
    , noAccess = require('../policies/noAccess')
    , config = require('../config')

module.exports = app => {
    return crateRouter([{
        method: "get",
        policy: config.USERS_CAN_READ_LOGS ? [] : noAccess,
        handler: async function getLogs(req, res, next){
            if (!config.SERVE_LOGS){
                return next()
            }
            req.session.logger(`sending logs`)
            return res.sendFile(config.SERVE_LOGS)
        }
    }])
}
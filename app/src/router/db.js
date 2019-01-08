const crateRouter = require('../helpers/createRouter')
    , noAccess = require('../policies/noAccess')
    , config = require('../config')

module.exports = app => {
    return crateRouter([{
        policy: noAccess,
        handler: function putDocument(req, res, next){
            req.session.logger(`redirecting to db admin page`)
            res.redirect(`http://localhost:${config.PORT_MONGO_ADMIN}/`)
        }
    }])
}
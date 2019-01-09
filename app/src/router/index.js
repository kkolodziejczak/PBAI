const httpStatus = require('http-status-codes')
    , createRouter = require('../helpers/createRouter')
    , config = require('../config')
    , log = require('../helpers/log')
    , printRoutes = require('../helpers/printRoutes')
    , getLocalRoutes = require('../helpers/getLocalRoutes')

module.exports = async app => {
    const router = createRouter([{
        handler: function app(req, res){
            return res.redirect('/index.html')
        }
    }], getLocalRoutes(app, __filename))

    router.use(function notFoundHandler(req, res, next){
        res.sendStatus(httpStatus.NOT_FOUND)
        return log.debug(`${httpStatus.NOT_FOUND} sent`)
    })

    router.use(function errorHandler(err, req, res, next){
        const status = err.httpStatus || httpStatus.INTERNAL_SERVER_ERROR
        res.sendStatus(status).send(
            config.NODE_ENV !== 'production' 
            ? err.stack 
            : httpStatus.getStatusText(status)
        )
        return log.error(err.stack)
    })
    
    app.use(router)
    await printRoutes(app)
}
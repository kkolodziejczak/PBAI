const _helmet = require('helmet')

module.exports = app => function helmet(req, res, next){
        app.use(_helmet())
        app.disable(`x-powered-by`)
        app.set(`trust proxy`, 1)
        next()
}
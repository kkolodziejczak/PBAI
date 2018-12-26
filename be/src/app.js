const express = require('express')
    , http = require('http')
    , https = require('https')
    , fs = require('fs-extra')
    , config = require('./config')
    , middlewares = require('./middlewares')
    , router = require('./router')
    , app = express()
    , log = require('./helpers/log')
 
module.exports = async ()=>{
    app.set('port', config.PORT)
    app.public = config.APP_PUBLIC

    await middlewares(app)
    await router(app)

    config.PRINT_CONFIG && Object.keys(config).forEach(key=>log.debug(`$${key}=${config[key]}`))

    return new Promise(async res=>{
        const server = (
            config.HTTPS 
            ? https.createServer({
                key: await fs.readFile(config.SSL_KEY_FILE),
                cert: await fs.readFile(config.SSL_CERT_FILE),
            }, app)
            : http.createServer(app)
        )
        .listen(
            app.get('port'), () => res({server, app, protocol: config.HTTPS?'https':'http'})
        )
    })
}
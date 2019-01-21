const crateRouter = require('../helpers/createRouter')
    , noAccess = require('../policies/noAccess')
    , config = require('../config')
    , proxyApp = require('express')()
    , session = require('express-session')
    , url = require('url') 
    , UsersCollection = require('../models/UsersCollection')
    , httpStatuses = require('http-status-codes')
    , portfinder = require('portfinder')

async function init(port){
    return new Promise(async res=>{
        proxyApp.use(session({
            cookie: { maxAge: config.COOKIE_MAX_AGE },
            store: new session.MemoryStore,
            saveUninitialized: true,
            resave: true,
            secret: config.SESSION_SECRET
        }))
        proxyApp.all(/.*/, async (req, res, next)=>{
            console.log(req.session.authenticated)
            console.log(req.session.id)
            if (!req.session.authenticated/*===undefined*/){
                try {
                    const user = await UsersCollection.findById(req.query.id)
                    req.session.authenticated = user.isAdmin
                }
                catch(e){}
            }
            if (req.session.authenticated){
                return res.redirect(`http://localhost:${config.PORT_MONGO_ADMIN}`+req.originalUrl)
            }
            return res.sendStatus(httpStatuses.NOT_FOUND)
        })
        proxyApp.listen(port, res)
    })
}

let proxyPort = -1
module.exports = app => {
    return crateRouter([{
        policy: noAccess,
        handler: async (req, res)=>
        {
            if (proxyPort===-1){
                proxyPort = await portfinder.getPortPromise()
                await init(proxyPort)
            }
            res.redirect(url.format({
            pathname: `http://localhost:${proxyPort}`,
            query: {
               "id": req.user._id.toString()
            }
          }))
        }
    }])
}
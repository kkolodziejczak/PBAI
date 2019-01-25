const Router = require('express').Router
    , log = require('./log')
    , admin = require('../policies/admin')
    , sendEmailHelper = require('../helpers/sendEmail')
    , config = require('../config')
    , readLastLines = require('read-last-lines');

function sendEmail(header){
    log.info(`sending email - ${header}`)
    return readLastLines.read(config.SERVE_LOGS, 10)
    .then(lines =>sendEmailHelper(header, lines))
    .then(info=>log.info('email sent'))
    .catch(err=>log.error(`error during sending email ${err.message}`))
}

async function runner(fun, req, res){
    if (typeof fun === typeof (()=>{})){
        return fun(req, res)
    }
    if (typeof fun === typeof []){
        for (f of fun){
            const err = await f(req, res)
            if (err){
                return err
            }
        }
    }
}

function checkPolicies(policies){
    return async function checkPolicies(req, res, next){
        if (admin(req, res)){
            return next()
        }
        const accessError = policies && await runner(policies, req, res)
        if (accessError){
            req.session.logger(`Access error ${accessError}`)
            if (config.SEND_EMAIL_ON_POLICY_ERROR){
                sendEmail("POLICY ISSUE")
            }
            return res.sendStatus(accessError)
        }
        return next()
    }
}

function validate(validators){
    return async function validate(req, res, next){
        const validationError = validators && await runner(validators, req, res)
        if (validationError){
            req.session.logger(`Validation error ${validationError.join ? validationError.join(', ') : validationError}`)
            if (config.SEND_EMAIL_ON_VALIDATION_ERROR){
                sendEmail("VALIDATION ISSUE")
            }
            return res.status(400).json(validationError)
        }
        return next()
    }
}

module.exports = function createRouter(routesConfig=[], localRoutes=[]){
    const router = Router()
    routesConfig.forEach(routeConfig=> {
        routeConfig.method = routeConfig.method || 'all'
        routeConfig.route = routeConfig.route || '/'
        if (typeof routeConfig.handler !== typeof (()=>{})){
            log.warn(`Handler for ${(routeConfig.method + ':') || ''} ${routeConfig.route} is not defined`)
            routeConfig.handler = (()=>{})
        }
        return router[routeConfig.method](
            routeConfig.route, 
            checkPolicies(routeConfig.policy), 
            validate(routeConfig.validation), 
            routeConfig.handler
        )
    })
    localRoutes.forEach(route => {
        router.use(route.path, route.router)
    })
    return router
}
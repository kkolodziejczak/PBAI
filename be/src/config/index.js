const dotenv = require('dotenv')
    , requirements = require('./config')
    , log = require('../helpers/log')
    , criticalError = require('../helpers/criticalError')

let config = null

function init(){
    config !== null && criticalError("Second inicialization of config object")
    const configBuilder = {}
    function setConfigBuilder(k, v){
        if (configBuilder.hasOwnProperty(k)){
            criticalError(`Environment variable ${k} has been already set`)
        }
        const parser = requirements.parsers[k]
        const val = typeof parser === typeof (()=>{}) ? parser(v) : v
        const validator = requirements.validators[k]
        const error = typeof validator === typeof (()=>{}) && requirements.validators[k](val)
        error && criticalError(error)
        configBuilder[k] = val
    }

    dotenv.config()
    if (!process.env.hasOwnProperty("NODE_ENV"))
        criticalError(`Required environment variable NODE_ENV is not set`)

    if (process.env.NODE_ENV !== 'production'){
        dotenv.config({
            path: './.env_' + process.env.NODE_ENV
        })
    }

    requirements.required.forEach(v=>{
        if (!process.env.hasOwnProperty(v)){
            criticalError(`Required environment variable ${v} is not set`)
        }
        setConfigBuilder(v, process.env[v])
    })

    Object.keys(requirements.optional).forEach(k=>{
        setConfigBuilder(k, process.env[k] || requirements.optional[k])
    })

    return config = new Proxy(configBuilder, {
        get(target, k) {
            if (!target.hasOwnProperty(k)){
                criticalError(`Config variable ${k} is not set`)
            }
            return target[k]
        },
        set(target, k){
            log.error(`cannot set config variables`)
        },
        deleteProperty(target, k) {
            log.error(`cannot delete config variables`)
        }
    })

}

module.exports = config || init()
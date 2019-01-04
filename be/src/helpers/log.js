const colors = require('colors')
    , fs = require('fs-extra')
    , config = require('../config')
    , LEVELS = Object.freeze({
        no: 4,
        info: 3,
        debug: 2,
        trace: 1
    })
    , DEFAULT_LEVEL = LEVELS.debug
    , LOG_PROVIDER = resolveLogProvider()
    , LEVEL = resolveLevel(config.LOG_LEVEL)

function getFileLoger(file){
    const writeStram = fs.createWriteStream(file, {flags : 'w'})
    if (config.LOG_TEMPLATE){
        writeStram.write(fs.readFileSync(config.LOG_TEMPLATE))
    }
    const logToFile = (...logs) => {
        writeStram.write(`${logs.join(' ')}\n`)
    }
    return logToFile
}

function resolveLogProvider(){
    const providers = [
        (color, ...args)=>console.log(colors[color](...args))
    ]
    if (config.SERVE_LOGS){
        const logToFile = getFileLoger(config.SERVE_LOGS)
        providers.push((color, ...logs) => 
            logToFile(...[`<p style="color: ${color}">`, ...logs, `</p>`])
        )
    }

    return (...logs) => providers.forEach(provider=>provider(...logs))
}

function resolveLevel(key){
    key = key.toLowerCase()
    if (LEVELS.hasOwnProperty(key)){
        return LEVELS[key]
    }
    key = Object.keys(LEVELS).filter(k=>LEVELS[k]===DEFAULT_LEVEL)[0]
    warn(`Logging level not set - setting ${key}`)
    return DEFAULT_LEVEL
}

function getDate() {
    const date = new Date()
    return '[' + [
        date.getFullYear(), 
        ("0" + (date.getMonth() + 1)).slice(-2), 
        ("0" + date.getDate()).slice(-2)
    ].join("-") + " " + [
        ("0" + date.getHours()).slice(-2), 
        ("0" + date.getMinutes()).slice(-2), 
        ("0" + date.getSeconds()).slice(-2), 
        ("0" + date.getMilliseconds()).slice(-2)
    ].join(':') + ']'
}

function logWithProvider(color, ...args){
    return LOG_PROVIDER(
        color,
        getDate(),
        ...args.map(a=>{
            if (typeof a === typeof {}){
                try {
                    return JSON.stringify(a, null, 2)
                }
                catch (e){
                    if (e.name === "TypeError"){
                        return "<CIRCUAL DEPENDENCY ERROR>"
                    }
                    throw e
                }
            }
            return a
        })
    )
}

function shouldLog (level, fun){
    return LEVEL <= level && fun()
}   

function trace(...args){
    return shouldLog(LEVELS.trace, ()=>logWithProvider('blue', ...args))
}

function debug(...args){
    return shouldLog(LEVELS.debug, ()=>logWithProvider('green', ...args))
}

function info(...args){
    return shouldLog(LEVELS.info, ()=>logWithProvider('white', ...args))
}

function warn(...args){
    if (process.env.NODE_NO_WARNINGS==="1"){
        return
    }
    return logWithProvider('yellow', ...['WARNING:', ...args])
}

function error(...args){
    return logWithProvider('red', ...['ERROR:', ...args])
}

function init(){
    log !== null && warn("Second inicialization of log object")
    log = {
        trace,
        debug,
        info,
        warn,
        error
    }
    return log
}

let log = null
module.exports = log || init()
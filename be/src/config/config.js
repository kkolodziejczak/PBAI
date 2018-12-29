const path = require('path')
    , fs = require('fs-extra')
    , randomstring = require("randomstring")

const string2Int = s => +s
const toBoleanOrString = s=> { 
    s = s.toLowerCase ? s.toLowerCase() : s
    if (typeof s === typeof true) {
        return s
    }
    return s==='true'?true:s==='false'?false:s
}
    
const toLower = s => String(s).toLowerCase()

const isDir = d => {
    if (!fs.existsSync(d) || !fs.statSync(d).isDirectory()){
        return `${d} is not a valid directory`
    }
}
const isFilePathValidIfTrue = f => toBoleanOrString(f)===true ? isFilePathValid(f) : null
const fileExistsIfTrue = f => toBoleanOrString(f)===true ? fileExists(f) : null
const isFilePathValid = f => isDir(path.dirname(f))
const fileExists = f => { 
    if (!fs.existsSync(f)){
        return `file ${d} doesn't exist`
    }
}
const isNumber = n => {
    if (Number.isNaN(n)) {
        return `${n} is not a number`
    }
}

const isMoreThan = (n,k) => {
    if (n<k){
        return `${n} is not more than ${k}`
    }
}

exports.required = [
    "NODE_ENV",
    "PORT",
    "PORT_MONGO_ADMIN",
    "MONGO_CONNECTION_STRING",
]

exports.optional = {
    "APP_PUBLIC": path.join(process.cwd(), `src`, `public`),
    "LOG_LEVEL": 'trace', // no, info, debug, trace
    "LOG_BODY": true,
    "LOG_TEMPLATE": false /** */|| path.join(process.cwd(), 'src', 'assets', 'log-template.html')/**/,
    "SESSION_SECRET": "OaMBtTO1UGw3ZCuPNdYU",
    "COOKIE_MAX_AGE": 1000*60*60*24,
    "GENERATED_ROUTES_FILE": false || path.join(process.cwd(), 'routes.txt'),
    "TIMERS_DATABASE_NAME": "timers_collection",
    "USERSS_DATABASE_NAME": "users_collection",
    "PERMISSIONS_DATABASE_NAME": "permissions_collection",
    "DOCUMENTS_DATABASE_NAME": "documents_collection",
    "SHARES_DATABASE_NAME": "shares_collection",
    "HTTPS": true,
    "SSL_CERT_FILE": path.join(process.cwd(), `src`, `assets`, 'ssl-cert.pem'),
    "SSL_KEY_FILE": path.join(process.cwd(), `src`, `assets`, 'ssl-key.pem'),
    "NO_CACHE": true,
    "LIMITER": true,
    "CORS": true,
    "STORE_SESSION_ON_MONGO": true,
    "ADMIN_SECRET": "7jWIWmPkuPBR74yTmdNh",
    "REJECT_BLACKLISTED_PASSWORDS": true,
    "SERVE_LOGS": false /** */|| path.join(__dirname, '..', 'logs.html'),
    "MAX_TIMER_SEC": 60*60*24*365, // one year
    "DH_PRIME_LENGTH": 2048,
    "CRYPTO_MOCKED": true,
    "USERS_CAN_READ_LOGS": true,
    "PRINT_CONFIG": true, // level debug
    "NODE_NO_WARNINGS": "1"
}

exports.parsers = {
    "NODE_ENV": toLower,
    "LOG_LEVEL": toLower,
    "LOG_BODY": toBoleanOrString,
    "PRINT_CONFIG": toBoleanOrString,
    "STORE_SESSION_ON_MONGO": toBoleanOrString,
    "HTTPS": toBoleanOrString,
    "NO_CACHE": toBoleanOrString,
    "CORS": toBoleanOrString,
    "CRYPTO_MOCKED": toBoleanOrString,
    "LIMITER": toBoleanOrString,
    "USERS_CAN_READ_LOGS": toBoleanOrString,
    "PORT": string2Int,
    "PORT_MONGO_ADMIN": string2Int,
    "COOKIE_MAX_AGE": string2Int,
    "MAX_TIMER_SEC": string2Int,
    "GENERATED_ROUTES_FILE": toBoleanOrString,
    "SSL_CERT_FILE": toBoleanOrString,
    "SSL_KEY_FILE": toBoleanOrString,
    "LOG_TEMPLATE": toBoleanOrString,
    "SERVE_LOGS": toBoleanOrString
}

exports.validators = {
    "APP_PUBLIC": isDir,
    "GENERATED_ROUTES_FILE": isFilePathValidIfTrue,
    "PORT": isNumber,
    "COOKIE_MAX_AGE": isNumber,
    "MAX_TIMER_SEC": n=>isNumber(n) || isMoreThan(n, 60),
    "LOG_TEMPLATE": fileExistsIfTrue,
    "SERVE_LOGS":  isFilePathValidIfTrue,
    "SSL_CERT_FILE": fileExistsIfTrue, 
    "SSL_KEY_FILE": fileExistsIfTrue,
}
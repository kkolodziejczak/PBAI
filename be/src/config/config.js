const path = require('path')
    , fs = require('fs-extra')
    , randomstring = require("randomstring")

const string2Int = s => +s
const toBolean = p => !!p
const toLower = s => String(s).toLowerCase()

const isDir = d => {
    if (!fs.existsSync(d) || !fs.statSync(d).isDirectory()){
        return `${d} is not a valid directory`
    }
}
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
    "LOG_LEVEL": 'trace', // info, debug, trace
    "LOG_BODY": true,
    "LOG_TEMPLATE": false /** */|| path.join(process.cwd(), 'src', 'assets', 'log-template.html')/**/,
    "SESSION_SECRET": "OaMBtTO1UGw3ZCuPNdYU",
    "COOKIE_MAX_AGE": 1000*60*60*24,
    "GENERATED_ROUTES_FILE": path.join(process.cwd(), 'routes.txt'),
    "TIMERS_DATABASE_NAME": "timers_collection",
    "USERSS_DATABASE_NAME": "users_collection",
    "PERMISSIONS_DATABASE_NAME": "permissions_collection",
    "DOCUMENTS_DATABASE_NAME": "documents_collection",
    "SHARES_DATABASE_NAME": "shares_collection",
    "CHECK_COMMON_PASSWORDS": true,
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
    "USERS_CAN_READ_LOGS": true
}

exports.parsers = {
    "NODE_ENV": toLower,
    "LOG_LEVEL": toLower,
    "LOG_BODY": toBolean,
    "CHECK_COMMON_PASSWORDS": toBolean,
    "STORE_SESSION_ON_MONGO": toBolean,
    "NO_CACHE": toBolean,
    "CORS": toBolean,
    "CRYPTO_MOCKED": toBolean,
    "LIMITER": toBolean,
    "USERS_CAN_READ_LOGS": toBolean,
    "PORT": string2Int,
    "PORT_MONGO_ADMIN": string2Int,
    "COOKIE_MAX_AGE": string2Int,
    "MAX_TIMER_SEC": string2Int
}

exports.validators = {
    "APP_PUBLIC": isDir,
    "GENERATED_ROUTES_FILE": isFilePathValid,
    "PORT": isNumber,
    "COOKIE_MAX_AGE": isNumber,
    "MAX_TIMER_SEC": n=>isNumber(n) || isMoreThan(n, 60),
    "LOG_TEMPLATE": fileExists,
    "SERVE_LOGS": p => (p!==false && isFilePathValid(p)) ? `Invalid path to file ${p}` : undefined,
    "SSL_CERT_FILE": fileExists, 
    "SSL_KEY_FILE": fileExists,
}
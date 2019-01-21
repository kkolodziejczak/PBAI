const path = require('path')
    , fs = require('fs-extra')

const string2Int = s => +s
const toBoleanOrString = s=> { 
    s = s.toLowerCase ? s.toLowerCase() : s
    if (typeof s === typeof true) {
        return s
    }
    return s==='true'?true:s==='false'?false:s
}
const toLower = s => String(s).toLowerCase()
const isBolean = b => b!==true && b!==false ? 'is not bolean' : undefined
const isDir = d => !fs.existsSync(d) || !fs.statSync(d).isDirectory() ? `${d} is not a valid directory` : undefined
const isFilePathValidIfTrue = f => toBoleanOrString(f)===true ? isFilePathValid(f) : null
const fileExistsIfTrue = f => toBoleanOrString(f)===true ? fileExists(f) : null
const isFilePathValid = f => isDir(path.dirname(f))
const fileExists = f => !fs.existsSync(f) ? `file ${d} doesn't exist` : undefined
const isNumber = n => Number.isNaN(n) ? `${n} is not a number` : undefined
const isMoreThan = (n,k) => (n<k) ? `${n} is not more than ${k}` : undefined

exports.required = [
    "NODE_ENV",
    "PORT",
    "PORT_MONGO_ADMIN",
    "MONGO_CONNECTION_STRING",
]

exports.optional = {
    "APP_PUBLIC": path.join(process.cwd(), `src`, `client`, `build`),
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
    "AUTH_LIMITER": true,
    "AUTH_LIMITER_RESET_PASSWORD": "sorry mr. server for bothering your awesomeness",
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
    "CREATE_ADMIN": true,
    "EMAILS": true,
    "EMAIL_SERVICE": "gmail",
    "EMAIL_LOGIN": "pbai.audyt@gmail.com",
    "EMAIL_PASSWORD": "YUQpRRj1OprtzGoVWAxU",
    "SEND_EMAIL_ON_VALIDATION_ERROR": true,
    "SEND_EMAIL_ON_POLICY_ERROR": true
}

exports.parsers = {
    "NODE_ENV": toLower,
    "LOG_LEVEL": toLower,
    "SEND_EMAIL_ON_POLICY_ERROR": toBoleanOrString,
    "SEND_EMAIL_ON_VALIDATION_ERROR": toBoleanOrString,
    "LOG_BODY": toBoleanOrString,
    "EMAILS": toBoleanOrString,
    "PRINT_CONFIG": toBoleanOrString,
    "STORE_SESSION_ON_MONGO": toBoleanOrString,
    "HTTPS": toBoleanOrString,
    "NO_CACHE": toBoleanOrString,
    "CORS": toBoleanOrString,
    "CRYPTO_MOCKED": toBoleanOrString,
    "LIMITER": toBoleanOrString,
    "AUTH_LIMITER": toBoleanOrString,
    "USERS_CAN_READ_LOGS": toBoleanOrString,
    "PORT": string2Int,
    "PORT_MONGO_ADMIN": string2Int,
    "PORT_MONGO_PROXY": string2Int,
    "COOKIE_MAX_AGE": string2Int,
    "MAX_TIMER_SEC": string2Int,
    "GENERATED_ROUTES_FILE": toBoleanOrString,
    "SSL_CERT_FILE": toBoleanOrString,
    "SSL_KEY_FILE": toBoleanOrString,
    "LOG_TEMPLATE": toBoleanOrString,
    "SERVE_LOGS": toBoleanOrString,
    "CREATE_ADMIN": toBoleanOrString,
    "REJECT_BLACKLISTED_PASSWORDS": toBoleanOrString,
    "AUTH_LIMITER_RESET_PASSWORD": toBoleanOrString
}

exports.validators = {
    "EMAILS": isBolean,
    "LOG_BODY": isBolean,
    "HTTPS": isBolean,
    "NO_CACHE": isBolean,
    "LIMITER": isBolean,
    "CORS": isBolean,
    "STORE_SESSION_ON_MONGO": isBolean,
    "REJECT_BLACKLISTED_PASSWORDS": isBolean,
    "CRYPTO_MOCKED": isBolean,
    "USERS_CAN_READ_LOGS": isBolean,
    "PRINT_CONFIG": isBolean,
    "CREATE_ADMIN": isBolean,
    "APP_PUBLIC": isDir,
    "GENERATED_ROUTES_FILE": isFilePathValidIfTrue,
    "PORT": isNumber,
    "PORT_MONGO_ADMIN": isNumber,
    "COOKIE_MAX_AGE": isNumber,
    "MAX_TIMER_SEC": n=>isNumber(n) || isMoreThan(n, 60),
    "LOG_TEMPLATE": fileExistsIfTrue,
    "SERVE_LOGS":  isFilePathValidIfTrue,
    "SSL_CERT_FILE": fileExistsIfTrue, 
    "SSL_KEY_FILE": fileExistsIfTrue,
    "SEND_EMAIL_ON_POLICY_ERROR": isBolean,
    "SEND_EMAIL_ON_VALIDATION_ERROR": isBolean
}
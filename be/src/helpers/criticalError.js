const log = require('./log')

module.exports = (...e) => {
    (log.error ?
        log.error :
        console.error)
        (...[...e, "\nCRITICAL ERROR: SHUTING DOWN THE SERVER"])
    return process.exit(1)
}
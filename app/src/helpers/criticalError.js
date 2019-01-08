module.exports = (...e) => {
    console.error(...[...e, "\nCRITICAL ERROR: SHUTING DOWN THE SERVER"])
    return process.exit(1)
}
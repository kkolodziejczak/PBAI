const printRoutes = require('express-print-routes')
    , config = require('../config')

module.exports = async app => config.GENERATED_ROUTES_FILE && (printRoutes(app, config.GENERATED_ROUTES_FILE) || true)
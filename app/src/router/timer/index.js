const crateRouter = require('../../helpers/createRouter')
    , getLocalRoutes = require('../../helpers/getLocalRoutes')

module.exports = app => {
    return crateRouter([], getLocalRoutes(app, __filename))
}
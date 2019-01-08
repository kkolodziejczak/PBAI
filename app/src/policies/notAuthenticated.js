const httpStatuses = require('http-status-codes')

module.exports = function notAuthenticated(req, res){
    if (req.isAuthenticated()){
        return httpStatuses.UNAUTHORIZED
    }
}
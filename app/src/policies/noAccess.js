const httpStatuses = require('http-status-codes')

module.exports = function noAccess(req, res){
    return httpStatuses.NOT_FOUND
}
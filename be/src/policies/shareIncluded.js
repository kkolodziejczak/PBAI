const shareDestination = require('./shareDestination')
    , shareOrigin = require('./shareOrigin')

module.exports = async function shareIncluded(req, res){
    return await shareOrigin(req, res) && await shareDestination(req, res)
}
const getPayloadValue = require('../helpers/getPayloadValue')
    , TimersCollection = require('../models/TimersCollection')
    , documentOwner = require('./documentOwner')

module.exports = async function canDeleteTimerPermission(req, res){
    const id = getPayloadValue(req, 'id')
    const timer = await TimersCollection.findById(id)
    // qucik and dirty solution
    req.id = timer.object
    const error = await documentOwner(req, res)
    req.id = id
    if (error){
        return error
    }
    req.body.timer = timer
}
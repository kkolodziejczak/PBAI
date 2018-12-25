const getPayloadValue = require('../helpers/getPayloadValue')
    , TimersCollection = require('../models/TimersCollection')
    , canReadPremission = require('./canReadPremission')

module.exports = async function canReadTimerPermission(req, res){
    const id = getPayloadValue(req, 'id')
    const timer = await TimersCollection.findById(id)
    // qucik and dirty solution
    req.id = timer.object
    const error = await canReadPremission(req, res)
    req.id = id
    if (error){
        return error
    }
    req.body.timer = timer
}
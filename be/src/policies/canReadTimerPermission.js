const getPayloadValue = require('../helpers/getPayloadValue')
    , TimersCollection = require('../models/TimersCollection')
    , canReadPermission = require('./canReadPermission')
    , httpStatuses = require('http-status-codes')

module.exports = async function canReadTimerPermission(req, res){
    const id = getPayloadValue(req, 'id')
    try{
    const timer = await TimersCollection.findById(id)
        if (!timer){
            return httpStatuses.NOT_FOUND
        }
        // qucik and dirty solution
        const tempId = req.body.id
        req.body.id = timer.object
        const error = await canReadPermission(req, res)
        req.body.id = tempId
        if (error){
            return error
        }
        req.body.timer = timer
    }
    catch(e){
        return httpStatuses.NOT_FOUND
    }
}
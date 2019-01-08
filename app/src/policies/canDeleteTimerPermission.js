const getPayloadValue = require('../helpers/getPayloadValue')
    , TimersCollection = require('../models/TimersCollection')
    , hasOwnerPermission = require('./hasOwnerPermission')
    , httpStatuses = require('http-status-codes')

module.exports = async function canDeleteTimerPermission(req, res){
    const id = getPayloadValue(req, 'id')
    try{
        const timer = await TimersCollection.findById(id)
        if (!timer){
            return httpStatuses.NOT_FOUND
        }
        // qucik and dirty solution
        const tempId = req.body.id 
        req.body.id = timer.object
        const error = await hasOwnerPermission(req, res)
        req.body.id = tempId
        if (error){
            return error
        }
    }
    catch(e){
        return httpStatuses.NOT_FOUND
    }
}
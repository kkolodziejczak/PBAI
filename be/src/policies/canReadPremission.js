const httpStatuses = require('http-status-codes')
    , getPayloadValue = require('../helpers/getPayloadValue')
    , PermissionsCollection = require('../models/PermissionsCollection')
    , hasOwnerPremission = require('./hasOwnerPremission')

module.exports = async function canReadPermission(req, res){
    const id = getPayloadValue(req, 'id')
    if (!id){
        return
    }
    const permission = await PermissionsCollection.findById(id)
    if (permission.userId.toString() !== req.user._id.toString()){
        const error = hasOwnerPremission(req, res)
        if (error){
            return error
        }
    }
    req.body.permission = permission
}
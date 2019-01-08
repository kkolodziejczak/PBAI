const httpStatuses = require('http-status-codes')
    , getPayloadValue = require('../helpers/getPayloadValue')
    , PermissionsCollection = require('../models/PermissionsCollection')
    , hasOwnerPermission = require('./hasOwnerPermission')

module.exports = async function canReadPermission(req, res){
    const id = getPayloadValue(req, 'id')
    if (!id){
        return
    }
    try{
        const permission = await PermissionsCollection.findById(id)
        if (!permission){
            return httpStatuses.NOT_FOUND
        }
        if (permission.userId.toString() !== req.user._id.toString()){
            const error = hasOwnerPermission(req, res)
            if (error){
                return error
            }
        }
        req.body.permission = permission
    }
    catch(e){
        return httpStatuses.NOT_FOUND
    }
}
const httpStatuses = require('http-status-codes')
    , getPayloadValue = require('../helpers/getPayloadValue')
    , DocumentsCollection = require('../models/DocumentsCollection')

module.exports = async function canReadDocument(req, res){
    const id = getPayloadValue(req, 'id')
    try{
        const permission = await DocumentsCollection.getUsersPermissionsToDocument(id, req.user._id)
        if (!permission || permission.userId.toString() !== req.user._id.toString()){
            return httpStatuses.NOT_FOUND
        }
        req.body.permission = permission
    }
    catch(e){
        return httpStatuses.NOT_FOUND
    }
}
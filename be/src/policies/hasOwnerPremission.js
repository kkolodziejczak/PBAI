const httpStatuses = require('http-status-codes')
    , getPayloadValue = require('../helpers/getPayloadValue')
    , PermissionsCollection = require('../models/PermissionsCollection')
    , DocumentsCollection = require('../models/DocumentsCollection')

module.exports = async function hasOwnerPremission(req, res){
    const id = getPayloadValue(req, 'id')
    const permission = await PermissionsCollection.findById(id)
    if (!permission){
        return httpStatuses.NOT_FOUND
    }
    const ownerPremission = await DocumentsCollection.getDocumentOwnerPremission(permission.documentId)
    if (!ownerPremission || ownerPremission.userId.toString() !== req.user._id.toString()){
        return httpStatuses.NOT_FOUND
    }
}
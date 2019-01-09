const httpStatuses = require('http-status-codes')
    , getPayloadValue = require('../helpers/getPayloadValue')
    , PermissionsCollection = require('../models/PermissionsCollection')
    , DocumentsCollection = require('../models/DocumentsCollection')

module.exports = async function hasOwnerPermission(req, res){
    const id = getPayloadValue(req, 'id')
    try{
        const permission = await PermissionsCollection.findById(id)
        if (!permission){
            return httpStatuses.NOT_FOUND
        }
        const ownerPermission = await DocumentsCollection.getDocumentOwnerPermission(permission.documentId)
        if (!ownerPermission || ownerPermission.userId.toString() !== req.user._id.toString()){
            return httpStatuses.NOT_FOUND
        }
    }
    catch(e){
        return httpStatuses.NOT_FOUND
    }
}
const httpStatuses = require('http-status-codes')
    , getPayloadValue = require('../helpers/getPayloadValue')
    , DocumentsCollection = require('../models/DocumentsCollection')

module.exports = async function documentOwner(req, res){
    const id = getPayloadValue(req, 'id')
    try{
        const ownerPermission = await DocumentsCollection.getDocumentOwnerPermission(id)
        if (!ownerPermission || ownerPermission.userId.toString() !== req.user._id.toString()){
            return httpStatuses.NOT_FOUND
        }
    }
    catch(e){
        return httpStatuses.NOT_FOUND
    }
}
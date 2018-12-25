const httpStatuses = require('http-status-codes')
    , getPayloadValue = require('../helpers/getPayloadValue')
    , DocumentsCollection = require('../models/DocumentsCollection')

module.exports = async function documentOwner(req, res){
    const id = getPayloadValue(req, 'id')
    const ownerPremission = await DocumentsCollection.getDocumentOwnerPremission(id)
    if (!ownerPremission || ownerPremission.userId.toString() !== req.user._id.toString()){
        return httpStatuses.NOT_FOUND
    }
}
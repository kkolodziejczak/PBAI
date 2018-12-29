const httpStatuses = require('http-status-codes')
    , getPayloadValue = require('../helpers/getPayloadValue')
    , SharesCollection = require('../models/SharesCollection')

module.exports = async function shareIncluded(req, res){
    const id = getPayloadValue(req, 'id')
    if (!id){
        return
    }
    try{
        const share = req.body.share || await SharesCollection.findById(id)
        if (!share || share.originUser.id.toString() !== req.user._id.toString()){
            return httpStatuses.NOT_FOUND
        }
    }
    catch (e){
        return httpStatuses.NOT_FOUND
    }
}

const mongoose = require('mongoose')
    , PermissionsCollection = require('./PermissionsCollection')
    , permissionsTypes = Object(require('../assets/permissionsTypes.json'))
    , createModel = require('../helpers/createModel')
    , log = require('../helpers/log')
    , config = require('../config')
    , documents = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true,
        },
        permissions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: config.PERMISSIONS_DATABASE_NAME
        }]
    })

const model = mongoose.model(config.DOCUMENTS_DATABASE_NAME, documents)

model.createNew = async function createNew(userId, name, content){
    const document = await createModel(model, {
        content, name, owner: userId, 
    })
    // circular dependency workaround
    const PC = Object.keys(PermissionsCollection).length 
    ? PermissionsCollection
    : require('./PermissionsCollection')
    const permission = await PC.createNew(
        userId, document._id, permissionsTypes.owner
    )
    document.permissions = [permission._id]
    await document.save()
    log.debug(`Document ${document._id} created`)
    return document
}

model.getUsersPermissionsToDocument = 
async function getUsersPermissionsToDocument(documentId, userId){
    const results = await model.findById(documentId)
    .populate({
        path: 'permissions',
        $match: {userId},
        options: { limit: 1 }
    })
    return results.permissions[0]
}

model.getDocumentOwnerPermission = async function getDocumentOwnerPermission(documentId){
    const results = await model.findById(documentId)
    .populate({
        path: 'permissions'
    })
    const ownerPermission = results.permissions.filter(p=>p.type==="o")
    return ownerPermission[0]
}

model.deletePermissions = async function deletePermissions(documentId, permissionId){
    const document = await model.findByIdAndUpdate(documentId, { 
        $pull: {
            permissions: permissionId
        }
    }, {new: true})
    if (document.permissions.length === 0){
        await model.findByIdAndDelete(document._id)
    }
}

module.exports = model
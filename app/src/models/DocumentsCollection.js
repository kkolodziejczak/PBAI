
let PermissionsCollection = require('./PermissionsCollection')
const mongoose = require('mongoose')
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
    if (!Object.keys(PermissionsCollection).length){
        PermissionsCollection = require('./PermissionsCollection')
    }
    const permission = await PermissionsCollection.createNew(
        userId, document._id, permissionsTypes.owner
    )
    document.permissions = [permission._id]
    await document.save()
    log.debug(`Document ${document._id} created`)
    return document
}

model.getUsersPermissionsToDocument = 
async function getUsersPermissionsToDocument(documentId, userId){
    try{
        const results = await model.findById(documentId)
        .populate({
            path: 'permissions'
        })
        const permissions = results.permissions.filter(permission=>permission.userId.toString()===userId.toString())
        return permissions.length ? permissions[0] : undefined
    }
    catch(e){
        return
    }
}

model.getDocumentOwnerPermission = async function getDocumentOwnerPermission(documentId){
    try{
        const results = await model.findById(documentId)
        .populate({
            path: 'permissions'
        })
        const ownerPermission = results.permissions.filter(p=>p.type==="o")
        return ownerPermission.length ? ownerPermission[0] : undefined
    }
    catch(e){
        return
    }
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
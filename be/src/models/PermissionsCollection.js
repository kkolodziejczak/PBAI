let UsersCollection = require('./UsersCollection')
    , DocumentsCollection = require('./DocumentsCollection')
    , SharesCollection = require('./SharesCollection')
const mongoose = require('mongoose')
, createModel = require('../helpers/createModel')
, config = require('../config')
, permissionsTypes = Object(require('../assets/permissionsTypes.json'))
, permissionsTypesEnum = Object.keys(permissionsTypes).map(k=>permissionsTypes[k])
, permissions = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: config.USERSS_DATABASE_NAME,
        required: true
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: config.DOCUMENTS_DATABASE_NAME,
        required: true
    },
    shareId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: config.SHARES_DATABASE_NAME
    },
    type: {
        type: String,
        enum: permissionsTypesEnum,
        required: true,
    },
    timer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: config.TIMERS_DATABASE_NAME,
        default: null,
    }
})

const model = mongoose.model(config.PERMISSIONS_DATABASE_NAME, permissions)

model.createNew = async function createNew(userId, documentId, type, shareId=undefined){
    if (type==="r" && shareId===undefined){
        throw new Error('Cannot create premission for reader without share object')
    }
    const permission = await createModel(model, {
        userId, documentId, type, shareId
    })
    if (!Object.keys(UsersCollection).length){
        UsersCollection = require('./UsersCollection')
    }
    await UsersCollection.findByIdAndUpdate(userId, {
        $push: {
            permissions: permission._id
        }
    })
    if (!Object.keys(DocumentsCollection).length){
        DocumentsCollection = require('./DocumentsCollection')
    }
    await DocumentsCollection.findByIdAndUpdate(documentId, {
        $push: {
            permissions: permission._id
        }
    })
    return permission
}

model.deletePermission = async function deletePermission(id, userId){
    const permission = await model.findById(id)
    if (permission.type === permissionsTypes.owner){
        let readers = await DocumentsCollection.findById(permission.documentId)
        .populate({
            path: 'permissions'
        })
        
        await Promise.all(
            readers.permissions
            .filter(permission=>permission.type==="r")
            .map(async permission=>deletePermission(permission._id, userId))
        )
    }
    if (permission.shareId){
        if (!Object.keys(SharesCollection).length){
            SharesCollection = require('./SharesCollection')
        }
        await SharesCollection.deleteShare(permission.shareId, userId)
    }
    if (!Object.keys(UsersCollection).length){
        UsersCollection = require('./UsersCollection')
    }
    await UsersCollection.deletePermission(permission.userId, permission._id)
    if (!Object.keys(DocumentsCollection).length){
        DocumentsCollection = require('./DocumentsCollection')
    }
    await DocumentsCollection.deletePermissions(permission.documentId, permission._id)
    await permission.delete()
}

module.exports = model
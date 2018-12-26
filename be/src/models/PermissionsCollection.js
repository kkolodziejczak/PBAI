
const mongoose = require('mongoose')
, createModel = require('../helpers/createModel')
, config = require('../config')
, UsersCollection = require('./UsersCollection')
, DocumentsCollection = require('./DocumentsCollection')
, SharesCollection = require('./SharesCollection')
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

model.createNew = async function createNew(userId, documentId, type){
    const permission = await createModel(model, {
        userId, documentId, type
    })
    const UC = Object.keys(UsersCollection).length 
    ? UsersCollection
    : require('./UsersCollection')
    await UC.findByIdAndUpdate(userId, {
        $push: {
            permissions: permission._id
        }
    })
    await DocumentsCollection.findByIdAndUpdate(documentId, {
        $push: {
            permissions: permission._id
        }
    })
    return permission
}

model.deletePermission = async function deletePermission(id){
    const permission = await model.findById(id)
    if (permission.type = permissionsTypes.owner){
        let readers = await permission.populate({
            path: 'documentId'
        }).populate({
            path: 'permissions'
        })
        readers = Array.isArray(readers) ? readers.permissions : [readers] 
        
        await Promise.all(readers
            .filter(permission=>permission.type==="r")
            .map(
            async permission=>{
                deletePermission(permission._id)
            })
        )
    }
    if (permission.shareId){
        await SharesCollection.deleteShare(permission.shareId)
    }
    const UC = Object.keys(UsersCollection).length 
    ? UsersCollection
    : require('./UsersCollection')
    await UC.deletePermission(permission.userId, permission._id)
    await DocumentsCollection.deletePermission(permission.documentId, permission._id)
}

module.exports = model
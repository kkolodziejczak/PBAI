const mongoose = require('mongoose')
, createModel = require('../helpers/createModel')
, config = require('../config')
, UsersCollection = require('./UsersCollection')
, PermissionsCollection = require('./PermissionsCollection')
, diffieHellman = config.CRYPTO_MOCKED 
    ? Object({
        getPrime: ()=> "r+pGR+exWIBfvd48XIYB16qtXILdw2524DlFB0s7O6R76dxlOnRNYUfF2dS11ZC5nXe4X5DI8VDYrmtAPvc73FTynaNk25kt0Yreh8BCR3JYlJNMQZavalHBJOIPrvNChg31mQGK6SMzD1ECHR/7mt6A75S1vnBFgLuMoYwLDqxpKtDCFhd3j8YUyu8dU4kvFZfCwmqYxqHdqpkLXi06uzsFM0CXvhgaPD9qRpcDh54NjThpt/UfT4Dygm9Uj0Nlxw+Nwr4MmSHlbSDS6lZNOytJXwkiHxNHlE6j16Fe+ZvmJRMX+WUUahaTLdFfE4nbJJ1KGV+PMBA642aj+Ydfkw==", 
        getGenerator: ()=> "Ag=="
    })
    : require('crypto').createDiffieHellman(config.DH_PRIME_LENGTH)
, states = {
    started: 0,
    accepted: 1,
    confirmed: 2,
    completed: 3,
    rejected: -1
}
, shares = new mongoose.Schema({
    originUser: {
        publicKey: {
            type: String
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: config.USERSS_DATABASE_NAME
        }
    },
    destinationUser: {
        publicKey: {
            type: String
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: config.USERSS_DATABASE_NAME
        }
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: config.DOCUMENTS_DATABASE_NAME,
        required: true
    },
    permissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: config.PERMISSIONS_DATABASE_NAME
    },
    prime: {
        type: String,
        required: true
    },
    generator: {
        type: String,
        required: true
    },
    crypted: {
        type: String
    },
    state: {
        type: Number,
        default: states.started,
    }
})

const model = mongoose.model(config.SHARES_DATABASE_NAME, shares)

model.createNew = async function createNew(originUserId, destinationUserId, documentId){
    const share = await createModel(model, {
        originUser: {id: originUserId},
        destinationUser: {id: destinationUserId},
        documentId,
        prime: diffieHellman.getPrime("base64"),
        generator: diffieHellman.getGenerator('base64')
    })
    try{
        const UC = Object.keys(UsersCollection).length 
        ? UsersCollection 
        : require('./UsersCollection')
        await UC.updateMany(
            { _id: { $in: [originUserId, destinationUserId] } },
            { $push: { shares: share._id } }
        )
    }
    catch(err){
        await share.delete()
        throw err
    }
    return share
}

model.deleteShare = async function deleteShare(id, userId){
    const share = await model.findById(id)
    const UC = Object(UsersCollection).length
    ? UsersCollection
    : require('./UsersCollection')
    if (!userId || (share.originUser && userId.toString() === share.originUser.id.toString())){
        if (share.originUser && share.destinationUser){
            await UC.deleteShare(share.originUser.id, share._id)
            await UC.deleteShare(share.destinationUser.id, share._id)
            share.originUser = null
            share.destinationUserId = null
            await share.save()
        }
        if (share.permissionId){
            const permissionId = share.permissionId
            share.permissionId = null
            await share.save()
            const PC = Object(PermissionsCollection).length
            ? PermissionsCollection
            : require('./PermissionsCollection')
            await PC.deletePermission(permissionId)
        }
        return share.delete()
    }
    if (userId.toString() === share.destinationUser.id.toString()){
        await UC.deleteShare(share.destinationUser.id, share._id)
        share.state = states.rejected
        await share.save()
    }
}

module.exports = model
const mongoose = require('mongoose')
    , bcrypt = require('bcrypt-nodejs')
    , config = require('../config')
    , PermissionsCollection = require('./PermissionsCollection')
    , SharesCollection = require('./SharesCollection')
    , users = new mongoose.Schema({
        login: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 20
        },
        password: {
            type: String,
            required: true,
            minlength: 4,
            maxlength: 40
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        permissions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: config.PERMISSIONS_DATABASE_NAME,
            default: []
        }],
        shares: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: config.SHARES_DATABASE_NAME,
            default: []
        }]
    }, {
        minimize: false
    })


users.methods.generateHash = function generateHash(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
} 

users.methods.isValidPassword = function isValidPassword(password){
    return bcrypt.compareSync(password, this.password)
}

const model = mongoose.model(config.USERSS_DATABASE_NAME, users)

model.createNew = async function createNew(login, password, admin){
    let newUser = new model()
    newUser.login = login
    newUser.password = newUser.generateHash(password)
    newUser.isAdmin = admin ? admin === config.ADMIN_SECRET : false
    return model.findOneAndUpdate({'login': login}, newUser, {upsert: true, new: true})
}

model.findAndValidate = async function findAndValidate(login, password){
    let user = await model.findOne({login: login})
    if (user && user.isValidPassword(password)){
        return user
    }
    return false
}

model.deletePermission = function deletePermission(userId, permissionId){
    return model.findByIdAndUpdate(userId, { 
        $pull: {
            permissions: permissionId
        }
    })
}

model.deleteShare = function deleteShare(userId, shareId){
    return model.findByIdAndUpdate(userId, { 
        $pull: { 
            shares: shareId 
        }
    })
}

model.deleteUser = async function deleteUser(query){
    const user = model.findOne(query)
    await Promise.all(user.permissions.map(
        permission=>PermissionsCollection.deletePermission(permission._id))
    )
    await Promise.all(user.shares.map(
        share=>SharesCollection.deleteShare(share._id))
    )
    return model.findByIdAndDelete(user._id)
}

module.exports = model
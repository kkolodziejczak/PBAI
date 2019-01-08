const mongoose = require('mongoose')
    , bcrypt = require('bcrypt-nodejs')
    , config = require('../config')
    , PermissionsCollection = require('./PermissionsCollection')
    , SharesCollection = require('./SharesCollection')
    , log = require('../helpers/log')
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
    let user = await model.findOne(query)
    if (!user){
        return
    }
    if (!Object.keys(PermissionsCollection).length){
        PermissionsCollection = require(`./PermissionsCollection`)
    }
    await Promise.all(user.permissions.map(
        permission=>PermissionsCollection.deletePermission(permission._id, user._id)
    ))
    user = await model.findOne(query)
    if (!Object.keys(SharesCollection).length){
        SharesCollection = require(`./SharesCollection`)
    }
    await Promise.all(user.shares.map(
        share=>SharesCollection.deleteShare(share._id, user._id)
    ))
    await model.findByIdAndDelete(user._id)
    return user
}

if (config.CREATE_ADMIN){
    (async ()=>{
        log.debug('Creating admin account')
        try {
            await model.createNew("admin", "admin", config.ADMIN_SECRET)
            log.debug('Creating admin account - done')
        }
        catch (e){
            if (e.codeName==="ImmutableField"){
                return log.warn('Creating admin account - already exists')
            }
            throw e
        }
    })()
}

module.exports = model
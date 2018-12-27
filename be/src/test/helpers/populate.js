const UsersCollection = require('../../models/UsersCollection')
    , DocumentsCollection = require('../../models/DocumentsCollection')
    , SharesCollection = require('../../models/SharesCollection')
    , PermissionsCollection = require('../../models/PermissionsCollection')
    , config = require('../../config')
    , agent = require('supertest').agent

const usersInfo = [{
    //0
    login: "admin",
    password: "admin",
    isAdmin: config.ADMIN_SECRET
}, {
    //1
    login: "partner",
    password: "partner",
    shared: [{
        getDocumentId: ()=>usersInfo[2].documents[0]._id,
        getPermissionId: ()=>usersInfo[2].shares[0].permissionId,
    }]
}, {
    //2
    login: "owner",
    password: "owner",
    documents: 3,
    shares: [{
        getPartnerId: ()=>usersInfo[1].userObject._id,
        getDocumentId: ()=>usersInfo[2].documents[0]._id,
        ownerKey: "ownerKey",
        partnerKey: "partnerKey"
    }, {
        getPartnerId: ()=>usersInfo[4].userObject._id,
        getDocumentId: ()=>usersInfo[2].documents[0]._id,
        ownerKey: "ownerKey",
        partnerKey: "partnerKey"
    }, {
        getPartnerId: ()=>usersInfo[6].userObject._id,
        getDocumentId: ()=>usersInfo[2].documents[0]._id,
        ownerKey: "ownerKey",
        partnerKey: "partnerKey"
    }]
}, {
    //3
    login: "malicious",
    password: "malicious"
}, {
    //4
    login: "noone",
    password: "noone",
    shared: [{
        getDocumentId: ()=>usersInfo[2].documents[0]._id,
        getPermissionId: ()=>usersInfo[2].shares[1].permissionId,
    }, {
        getDocumentId: ()=>usersInfo[6].documents[0]._id,
        getPermissionId: ()=>usersInfo[6].shares[0].permissionId,
    }]
}, {
    //5
    login: "toBeDeleted",
    password: "toBeDeleted"
}, {
    //6
    login: "toBeDeletedWithResources",
    password: "toBeDeletedWithResources",
    documents: 1,
    shared: [{
        getDocumentId: ()=>usersInfo[2].documents[0]._id,
        getPermissionId: ()=>usersInfo[2].shares[2].permissionId,
    }],
    shares: [{
        getPartnerId: ()=>usersInfo[4].userObject._id,
        getDocumentId: ()=>usersInfo[6].documents[0]._id,
        ownerKey: "ownerKey",
        partnerKey: "partnerKey"
    }]
}, {
    //7
    login: "toBeChanged",
    password: "toBeChanged",
}, {
    //8
    login: "passwordtoBeChanged",
    password: "passwordtoBeChanged",
}, {
    //9
    login: "logintoBeChanged",
    password: "logintoBeChanged",
}, {
    //10
    login: "toBeChangedbyAdmin",
    password: "toBeChangedbyAdmin",
}]

module.exports = async function populate(app){
    for (const userInfo of usersInfo){
        userInfo.userObject = await UsersCollection.createNew(
            userInfo.login, userInfo.password, userInfo.isAdmin
        )
        const documents = userInfo.documents || 0
        userInfo.documents = []
        for (let i of Array(documents).keys()){
            userInfo.documents.push(await DocumentsCollection.createNew(
                userInfo.userObject._id, `example${i}`, "ZG9jdW1lbnQ="
            ))
        }
        userInfo.agent = agent(app)
        await userInfo.agent
        .post('/auth')
        .send({
            login: userInfo.login,
            password: userInfo.password
        })
        .expect(302)
    }
    for (const userInfo of usersInfo){
        const shares = userInfo.shares || []
        userInfo.shares = []
        for (let i in shares){
            const share = await SharesCollection.createNew(
                userInfo.userObject._id, shares[i].getPartnerId(), shares[i].getDocumentId()
            )
            share.originUser.publicKey = shares[i].ownerKey
            share.destinationUser.publicKey = shares[i].partnerKey
            share.state = 4
            const permission = await PermissionsCollection.createNew(
                shares[i].getPartnerId(), shares[i].getDocumentId(), "r", share._id
            )
            share.permissionId = permission._id
            await share.save()
            userInfo.shares.push(share)
        }
    }
    for (const userInfo of usersInfo){
        const shared = userInfo.shared || []
        userInfo.shared = []
        for (let i in shared){
            userInfo.shared.push({
                documentId: shared[i].getDocumentId(),
                permissionId: shared[i].getPermissionId()
            })
        }
    }
    return usersInfo
}

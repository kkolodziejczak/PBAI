const UsersCollection = require('../../models/UsersCollection')
    , DocumentsCollection = require('../../models/DocumentsCollection')
    , config = require('../../config')
    , agent = require('supertest').agent

const usersInfo = [{
    login: "admin",
    password: "admin",
    isAdmin: config.ADMIN_SECRET
}, {
    login: "owner",
    password: "owner",
    documents: 3
}, {
    login: "partner",
    password: "partner"
}, {
    login: "malicious",
    password: "malicious"
}]

module.exports = async function populate(app){
    for (const userInfo of usersInfo){
        userInfo.userObject = await UsersCollection.createNew(
            userInfo.login, userInfo.password, userInfo.isAdmin
        )
        const documents = userInfo.documents || []
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
    return usersInfo
}

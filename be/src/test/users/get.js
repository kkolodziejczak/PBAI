const agent = require('supertest').agent
    , path = require('path')
    , hasProps = require('../helpers/hasProps')
    , UsersCollection = require('../../models/UsersCollection')

module.exports = function test(config){
    describe(path.parse(__filename).name, ()=>{
        it('user can check his informations', async ()=>{
            const user = await UsersCollection.findById(config.users[2].userObject._id)
            return await config.users[2].agent
            .get(`/users`)
            .expect(200)
            .expect(hasProps({
                isAdmin: user.isAdmin,
                permissions: user.permissions.map(p=>p._id.toString()),
                shares: user.shares.map(s=>s._id.toString()),
                login: user.login
            }))
        })
        it('unauthenticated user can not check his informations', async ()=>{
            return await agent(config.app)
            .get(`/users`)
            .expect(401)
        })
    })
}
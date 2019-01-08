const agent = require('supertest').agent
    , path = require('path')
    , should = require('should')
    , UsersCollection = require('../../models/UsersCollection')

module.exports = function test(config){
    describe(path.parse(__filename).name, async()=>{
        it('regular user can not delete anyones account', async ()=>{
            return await config.users[2].agent
            .delete(`/users`)
            .send({
                login: config.users[2].login
            })
            .expect(404)
        })
        it('unauthenticated user can not delete anyones account', async ()=>{
            return await agent(config.app)
            .delete(`/users`)
            .send({
                login: config.users[2].login
            })
            .expect(404)
        })
        it('admin can delete anyones account', async ()=>{
            await config.users[0].agent
            .delete(`/users`)
            .send({
                login: config.users[5].login
            })
            .expect(200)
            should(await UsersCollection.findOne({
                login: config.users[5].login
            })).not.be.ok()
        })
        it('admin can delete anyones account with their resources', async ()=>{
            return await config.users[0].agent
            .delete(`/users`)
            .send({
                login: config.users[6].login
            })
            .expect(200)
        })
        it('admin can not delete account if it does not exist', async ()=>{
            return config.users[0].agent
            .delete(`/users`)
            .send({
                login: 'thisUserDoesNotExist'
            })
            .expect(404)
        })
    })
}
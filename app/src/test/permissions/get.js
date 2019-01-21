const agent = require('supertest').agent
    , path = require('path')
    , hasProps = require('../helpers/hasProps')
    , PermissionsCollection = require('../../models/PermissionsCollection')

module.exports = function test(config){
    describe(path.parse(__filename).name, ()=>{
        it('user can get his permissions', async ()=>{
            const permissions = await PermissionsCollection.find({userId: config.users[2].userObject._id})
            await config.users[2].agent
            .get('/permissions')
            .expect(200)
            .expect(hasProps(permissions.map(p=>p._id.toString())))
        })
        it('not authenticated user can not get his permissions', async ()=>{
            await agent(config.app)
            .get('/permissions')
            .expect(401)
        })
        it('admin can get all permissions', async ()=>{
            const allPermissions = await PermissionsCollection.find({type: "o"})
            await config.users[0].agent
            .get('/permissions')
            .expect(200)
            .expect(hasProps(allPermissions.map(e=>e._id.toString())))
        })
        it('user can get his permission', async ()=>{
            const permissionId = config.users[2].documents[0].permissions[0]._id.toString()
            await config.users[2].agent
            .get(`/permissions/${permissionId}`)
            .expect(200)
            .expect(hasProps({
                id: permissionId
            }))
        })
        it('not authenticated user can not get his permission', async ()=>{
            const permissionId = config.users[2].documents[0].permissions[0]._id.toString()
            await agent(config.app)
            .get(`/permissions/${permissionId}`)
            .expect(401)
        })
        it('admin can get any permission', async ()=>{
            const permissionId = config.users[2].documents[0].permissions[0]._id.toString()
            await config.users[0].agent
            .get(`/permissions/${permissionId}`)
            .expect(200)
            .expect(hasProps({
                id: permissionId
            }))
        })
    })
}
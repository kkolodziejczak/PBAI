const agent = require('supertest').agent
    , path = require('path')
    , hasProps = require('../helpers/hasProps')

module.exports = function test(config){
    describe(path.parse(__filename).name, ()=>{
        it('only owner can delete a permission', async ()=>{
            const permissionId = config.users[14].shared[0].permissionId.toString()
            await config.users[14].agent
            .get(`/permissions/${permissionId}`)
            .expect(200)
            await config.users[14].agent
            .delete('/permissions')
            .send({
                id: permissionId
            })
            .expect(404)
        })
        it('admin can not delete a not existing permission', async ()=>{
            await config.users[0].agent
            .delete('/permissions')
            .send({
                id: 'thisDoesesfono'
            })
            .expect(400)
        })
        it('owner can delete permission for only one partner', async ()=>{
            const permissionId = config.users[15].shared[0].permissionId.toString()
            await config.users[15].agent
            .get(`/permissions/${permissionId}`)
            .expect(200)
            await config.users[16].agent
            .delete('/permissions')
            .send({
                id: permissionId
            })
            .expect(200)
            await config.users[15].agent
            .get(`/permissions/${permissionId}`)
            .expect(404)
            await config.users[14].agent
            .get(`/permissions/${config.users[14].shared[0].permissionId.toString()}`)
            .expect(200)
        })
        it('owner can delete permission for only one partner', async ()=>{
            const permissionId = config.users[14].shared[0].permissionId.toString()
            await config.users[14].agent
            .get(`/permissions/${permissionId}`)
            .expect(200)
            await config.users[0].agent
            .delete('/permissions')
            .send({
                id: permissionId
            })
            .expect(200)
            await config.users[14].agent
            .get(`/permissions/${permissionId}`)
            .expect(404)
        })
        it('owner can delete permission for only one partner', async ()=>{
            const ownerPermissionId = config.users[16].shares[2].permissionId.toString()
            const partnerPermissionId = config.users[14].shared[1].permissionId.toString()
            await config.users[16].agent
            .get(`/permissions/${ownerPermissionId}`)
            .expect(200)
            await config.users[14].agent
            .get(`/permissions/${partnerPermissionId}`)
            .expect(200)
            await config.users[16].agent
            .delete('/permissions')
            .send({
                id: ownerPermissionId
            })
            .expect(200)
            await config.users[16].agent
            .get(`/permissions/${ownerPermissionId}`)
            .expect(404)
            await config.users[14].agent
            .get(`/permissions/${partnerPermissionId}`)
            .expect(404)
        })
    })
}
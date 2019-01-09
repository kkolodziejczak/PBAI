const agent = require('supertest').agent
    , path = require('path')
    , hasProps = require('../helpers/hasProps')

module.exports = function test(config){
    describe(path.parse(__filename).name, ()=>{
        it('document owner can delete own share', async ()=>{
            const id = config.users[12].shares[0]._id.toString()
            await config.users[12].agent
            .delete('/shares')
            .send({id})
            .expect(200)
            await config.users[12].agent
            .get(`/shares/${id}`)
            .expect(404)
            await config.users[11].agent
            .get(`/shares/${id}`)
            .expect(404)
        })
        it('share partner can delete owner share', async ()=>{
            const share = config.users[12].shares[1]
            const id = share.id.toString()
            await config.users[11].agent
            .delete('/shares')
            .send({id})
            .expect(200)
            await config.users[11].agent
            .get(`/shares/${id}`)
            .expect(404)
            await config.users[12].agent
            .get(`/shares/${id}`)
            .expect(200)
            .expect(hasProps({
                id: share.id.toString(),
                permissionId: share.permissionId.toString(),
                prime: share.prime,
                generator: share.generator,
                state: -1
            }))
        })
        it('admin can delete any share', async ()=>{
            const id = config.users[12].shares[2]._id.toString()
            await config.users[0].agent
            .delete('/shares')
            .send({id})
            .expect(200)
            await config.users[12].agent
            .get(`/shares/${id}`)
            .expect(404)
            await config.users[11].agent
            .get(`/shares/${id}`)
            .expect(404)
        })
        it('user can not delete somebodys share', async ()=>{
            const id = config.users[12].shares[3]._id.toString()
            await config.users[2].agent
            .delete('/shares')
            .send({id})
            .expect(404)
        })
        it('not authenticated user can not delete a share', async ()=>{
            const id = config.users[12].shares[3]._id.toString()
            await agent(config.app)
            .delete('/shares')
            .send({id})
            .expect(401)
        })
        it('admin can not delete a share if it does not exist', async ()=>{
            const id = 'aldalgglnglwgn3qgoiw32423'
            await config.users[0].agent
            .delete('/shares')
            .send({id})
            .expect(404)
        })
    })
}
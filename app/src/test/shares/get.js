const agent = require('supertest').agent
    , path = require('path')
    , hasProps = require('../helpers/hasProps')
    , SharesCollection = require('../../models/SharesCollection')

module.exports = function test(config){
    describe(path.parse(__filename).name, ()=>{
        it('user can get his shares', async ()=>{
            await config.users[2].agent
            .get('/shares')
            .expect(200)
            .expect(hasProps(config.users[2].shares.map(s=>s._id.toString())))
        })
        it('not authenticated user can not get his shares', async ()=>{
            await agent(config.app)
            .get('/shares')
            .expect(401)
        })
        it('admin can get all shares', async ()=>{
            const allShares = await SharesCollection.find({})
            await config.users[0].agent
            .get('/shares')
            .expect(200)
            .expect(hasProps(allShares.map(e=>e._id.toString())))
        })
        it('user can get his share', async ()=>{
            const share = config.users[2].shares[0]
            await config.users[2].agent
            .get(`/shares/${share.id}`)
            .expect(200)
        })
        it('not authenticated user can not get his share', async ()=>{
            const share = config.users[2].shares[0]
            await agent(config.app)
            .get(`/shares/${share.id}`)
            .expect(401)
        })
        it('admin can get any share', async ()=>{
            const share = config.users[2].shares[0]
            await config.users[0].agent
            .get(`/shares/${share.id}`)
            .expect(200)
            .expect(hasProps({
                id: share._id.toString(),
                permissionId: share.permissionId.toString(),
                prime: share.prime,
                generator: share.generator,
                crypted: null
            }))
        })
    })
}
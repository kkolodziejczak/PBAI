const agent = require('supertest').agent
    , path = require('path')
    , hasProps = require('../helpers/hasProps')

module.exports = function test(config){
    describe(path.parse(__filename).name, ()=>{
        describe('status 0', ()=>{
            it('not authenticated user can not make any share proceed', async ()=>{
                const share = config.users[13].shares[0]
                await agent(config.app)
                .post(`/shares/${share._id.toString()}/0`)
                .send({
                    publicKey: share.originUser.publicKey
                })
                .expect(401)
            })
            it('user can not make somebodys share proceed', async ()=>{
                const share = config.users[13].shares[0]
                await config.users[1].agent
                .post(`/shares/${share._id.toString()}/0`)
                .send({
                    publicKey: share.originUser.publicKey
                })
                .expect(404)
            })
            it('partner can not make share proceed', async ()=>{
                const share = config.users[13].shares[0]
                await config.users[11].agent
                .post(`/shares/${share._id.toString()}/0`)
                .send({
                    publicKey: share.originUser.publicKey
                })
                .expect(404)
            })
            it('owner can not make share proceed without a key', async ()=>{
                const share = config.users[13].shares[0]
                await config.users[13].agent
                .post(`/shares/${share._id.toString()}/0`)
                .send({
                })
                .expect(400)
            })
            it('owner can make share proceed', async ()=>{
                const share = config.users[13].shares[0]
                await config.users[13].agent
                .post(`/shares/${share._id.toString()}/0`)
                .send({
                    publicKey: share.originUser.publicKey
                })
                .expect(200)
                await config.users[13].agent
                .get(`/shares/${share._id.toString()}`)
                .expect(200) 
                .expect(hasProps({
                    state: share.state+1
                }))
            })
            it('admin can not make share proceed without a key', async ()=>{
                const share = config.users[13].shares[1]
                await config.users[0].agent
                .post(`/shares/${share._id.toString()}/0`)
                .send({
                })
                .expect(400)
            })
            it('admin can make share proceed', async ()=>{
                const share = config.users[13].shares[1]
                await config.users[0].agent
                .post(`/shares/${share._id.toString()}/0`)
                .send({
                    publicKey: share.originUser.publicKey
                })
                .expect(200)
                await config.users[0].agent
                .get(`/shares/${share._id.toString()}`)
                .expect(200) 
                .expect(hasProps({
                    state: share.state+1
                }))
            })
        })
        describe('status 1', ()=>{
            it('not authenticated user can not make any share proceed', async ()=>{
                const share = config.users[13].shares[2]
                await agent(config.app)
                .post(`/shares/${share._id.toString()}/1`)
                .send({
                    publicKey: share.destinationUser.publicKey
                })
                .expect(401)
            })
            it('user can not make somebodys share proceed', async ()=>{
                const share = config.users[13].shares[2]
                await config.users[1].agent
                .post(`/shares/${share._id.toString()}/1`)
                .send({
                    publicKey: share.destinationUser.publicKey
                })
                .expect(404)
            })
            it('owner can not make share proceed', async ()=>{
                const share = config.users[13].shares[2]
                await config.users[13].agent
                .post(`/shares/${share._id.toString()}/1`)
                .send({
                    publicKey: share.destinationUser.publicKey
                })
                .expect(404)
            })
            it('partner can not make share proceed without a key', async ()=>{
                const share = config.users[13].shares[2]
                await config.users[11].agent
                .post(`/shares/${share._id.toString()}/1`)
                .send({
                })
                .expect(400)
            })
            it('partner can make share proceed', async ()=>{
                const share = config.users[13].shares[2]
                await config.users[11].agent
                .post(`/shares/${share._id.toString()}/1`)
                .send({
                    publicKey: share.destinationUser.publicKey
                })
                .expect(200)
                await config.users[13].agent
                .get(`/shares/${share._id.toString()}`)
                .expect(200) 
                .expect(hasProps({
                    state: share.state+1
                }))
            })
            it('admin can not make share proceed without a key', async ()=>{
                const share = config.users[13].shares[3]
                await config.users[0].agent
                .post(`/shares/${share._id.toString()}/1`)
                .send({
                })
                .expect(400)
            })
            it('admin can make share proceed', async ()=>{
                const share = config.users[13].shares[3]
                await config.users[0].agent
                .post(`/shares/${share._id.toString()}/1`)
                .send({
                    publicKey: share.destinationUser.publicKey
                })
                .expect(200)
                await config.users[0].agent
                .get(`/shares/${share._id.toString()}`)
                .expect(200) 
                .expect(hasProps({
                    state: share.state+1
                }))
            })
        })
        describe('status 2', ()=>{
            it('not authenticated user can not make any share proceed', async ()=>{
                const share = config.users[13].shares[4]
                await agent(config.app)
                .post(`/shares/${share._id.toString()}/2`)
                .send({
                    publicKey: share.originUser.publicKey,
                    crypted: 'SECRET'
                })
                .expect(401)
            })
            it('user can not make somebodys share proceed', async ()=>{
                const share = config.users[13].shares[4]
                await config.users[1].agent
                .post(`/shares/${share._id.toString()}/2`)
                .send({
                    publicKey: share.originUser.publicKey,
                    crypted: 'SECRET'
                })
                .expect(404)
            })
            it('partner can not make share proceed', async ()=>{
                const share = config.users[13].shares[4]
                await config.users[11].agent
                .post(`/shares/${share._id.toString()}/2`)
                .send({
                    publicKey: share.originUser.publicKey,
                    crypted: 'SECRET'
                })
                .expect(404)
            })
            it('owner can not make share proceed without a key', async ()=>{
                const share = config.users[13].shares[4]
                await config.users[13].agent
                .post(`/shares/${share._id.toString()}/2`)
                .send({
                    crypted: 'SECRET'
                })
                .expect(400)
            })
            it('owner can make share proceed', async ()=>{
                const share = config.users[13].shares[4]
                await config.users[13].agent
                .post(`/shares/${share._id.toString()}/2`)
                .send({
                    publicKey: share.originUser.publicKey,
                    crypted: 'SECRET'
                })
                .expect(200)
                await config.users[13].agent
                .get(`/shares/${share._id.toString()}`)
                .expect(200) 
                .expect(hasProps({
                    state: share.state+1
                }))
            })
            it('admin can not make share proceed without a key', async ()=>{
                const share = config.users[13].shares[5]
                await config.users[0].agent
                .post(`/shares/${share._id.toString()}/2`)
                .send({
                    crypted: 'SECRET'
                })
                .expect(400)
            })
            it('admin can make share proceed', async ()=>{
                const share = config.users[13].shares[5]
                await config.users[0].agent
                .post(`/shares/${share._id.toString()}/2`)
                .send({
                    publicKey: share.originUser.publicKey,
                    crypted: 'SECRET'
                })
                .expect(200)
                await config.users[0].agent
                .get(`/shares/${share._id.toString()}`)
                .expect(200) 
                .expect(hasProps({
                    state: share.state+1
                }))
            })
        })
        describe('status 3', ()=>{
            it('not authenticated user can not make any share proceed', async ()=>{
                const share = config.users[13].shares[6]
                await agent(config.app)
                .post(`/shares/${share._id.toString()}/3`)
                .send({
                    publicKey: share.destinationUser.publicKey
                })
                .expect(401)
            })
            it('user can not make somebodys share proceed', async ()=>{
                const share = config.users[13].shares[6]
                await config.users[1].agent
                .post(`/shares/${share._id.toString()}/3`)
                .send({
                    publicKey: share.destinationUser.publicKey
                })
                .expect(404)
            })
            it('owner can not make share proceed', async ()=>{
                const share = config.users[13].shares[6]
                await config.users[13].agent
                .post(`/shares/${share._id.toString()}/3`)
                .send({
                    publicKey: share.destinationUser.publicKey
                })
                .expect(404)
            })
            it('partner can not make share proceed without a key', async ()=>{
                const share = config.users[13].shares[6]
                await config.users[11].agent
                .post(`/shares/${share._id.toString()}/3`)
                .send({
                })
                .expect(400)
            })
            it('partner can make share proceed', async ()=>{
                const share = config.users[13].shares[6]
                await config.users[11].agent
                .post(`/shares/${share._id.toString()}/3`)
                .send({
                    publicKey: share.destinationUser.publicKey
                })
                .expect(200)
                .expect(hasProps({
                    crypted: 'SECRET'
                }))
            })
            it('admin can not make share proceed without a key', async ()=>{
                const share = config.users[13].shares[7]
                await config.users[0].agent
                .post(`/shares/${share._id.toString()}/3`)
                .send({
                })
                .expect(400)
            })
            it('admin can make share proceed', async ()=>{
                const share = config.users[13].shares[7]
                await config.users[0].agent
                .post(`/shares/${share._id.toString()}/3`)
                .send({
                    publicKey: share.destinationUser.publicKey
                })
                .expect(200)
                .expect(hasProps({
                    crypted: 'SECRET'
                }))
                
            })
        })
    })
}
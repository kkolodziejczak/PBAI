const agent = require('supertest').agent
    , path = require('path')

module.exports = function test(config){
    describe(path.parse(__filename).name, ()=>{
        it('document owner can share his document', async ()=>{
            const share = await config.users[2].agent
            .put('/shares')
            .send({ 
                id: config.users[2].documents[1]._id,
                login: config.users[1].login
            })
            .expect(200)
            let owner = await config.users[2].agent
            .get('/users')
            .expect(200)
            let partner = await config.users[1].agent
            .get('/users')
            .expect(200)
            owner.body.shares.should.containEql(share.body.id)
            partner.body.shares.should.containEql(share.body.id)
        })
        it('document owner can not share his document to no existing account', async ()=>{
            await config.users[2].agent
            .put('/shares')
            .send({ 
                id: config.users[2].documents[1]._id,
                login: "trolololo"
            })
            .expect(400)
        })
        it('document owner can not share not existing document', async ()=>{
            await config.users[2].agent
            .put('/shares')
            .send({ 
                id: "somefakeid",
                login: config.users[1].login
            })
            .expect(404)
        })
        it('admin can share somebodys document', async ()=>{
            const share = await config.users[0].agent
            .put('/shares')
            .send({ 
                id: config.users[2].documents[2]._id,
                login: config.users[1].login
            })
            .expect(200)
            let owner = await config.users[2].agent
            .get('/users')
            .expect(200)
            let partner = await config.users[1].agent
            .get('/users')
            .expect(200)
            owner.body.shares.should.containEql(share.body.id)
            partner.body.shares.should.containEql(share.body.id)
        })
        it('admin can not share somebodys document to no existing account', async ()=>{
            await config.users[0].agent
            .put('/shares')
            .send({ 
                id: config.users[2].documents[1]._id,
                login: "trolololo"
            })
            .expect(400)
        })
        it('admin can not share not existing document', async ()=>{
            await config.users[0].agent
            .put('/shares')
            .send({ 
                id: "somefakeid",
                login: config.users[1].login
            })
            .expect(404)
        })
        it('not authenticate user can not share a document', async ()=>{
            await agent(config.app)
            .put('/shares')
            .send({ 
                id: config.users[2].documents[1]._id,
                login: config.users[3].login
            })
            .expect(401)
        })
        it('document owner can not share a document with himselv', async ()=>{
            await config.users[2].agent
            .put('/shares')
            .send({ 
                id: config.users[2].documents[1]._id,
                login: config.users[2].login
            })
            .expect(400)
        })
        it('shared document can not be share further', async ()=>{
            const share = await config.users[2].agent
            .put('/shares')
            .send({ 
                id: config.users[2].documents[3]._id,
                login: config.users[1].login
            })
            .expect(200)
            let owner = await config.users[2].agent
            .get('/users')
            .expect(200)
            let partner = await config.users[1].agent
            .get('/users')
            .expect(200)
            owner.body.shares.should.containEql(share.body.id)
            partner.body.shares.should.containEql(share.body.id)
            await config.users[1].agent
            .put('/shares')
            .send({ 
                id: config.users[2].documents[3]._id,
                login: config.users[4].login
            })
            .expect(404)
        })
        it('document owner can share his document to somebody again', async ()=>{
            const share = await config.users[2].agent
            .put('/shares')
            .send({ 
                id: config.users[2].documents[4]._id,
                login: config.users[1].login
            })
            .expect(200)
            let owner = await config.users[2].agent
            .get('/users')
            .expect(200)
            let partner = await config.users[1].agent
            .get('/users')
            .expect(200)
            owner.body.shares.should.containEql(share.body.id)
            partner.body.shares.should.containEql(share.body.id)
            await config.users[2].agent
            .put('/shares')
            .send({ 
                id: config.users[2].documents[4]._id,
                login: config.users[1].login
            })
            .expect(200)
        })
    })
}
const agent = require('supertest').agent
    , path = require('path')
    , hasProps = require('../helpers/hasProps')

module.exports = function test(config){
    describe(path.parse(__filename).name, ()=>{
        it('authenticated user can send a document', async ()=>{
            let document = await config.users[4].agent
            .put('/documents')
            .send({ 
                name: 'exmple',
                content: "ZG9jdW1lbnQ="
            })
            .expect(200)
            await config.users[4].agent
            .get(`/documents/${document.body.id}`)
            .expect(200)
            .expect(hasProps({
                id: document.body.id.toString()
            }))
        })
        it('not authenticated user can not send a document', async()=>{
            await agent(config.app)
            .put('/documents')
            .send({ 
                name: 'exmple',
                content: "ZG9jdW1lbnQ="
            })
            .expect(401)
        })
        it('name is required', async ()=>{
            await config.users[4].agent
            .put('/documents')
            .send({ 
                content: "ZG9jdW1lbnQ="
            })
            .expect(400)
        })
        it('content is required', async ()=>{
            await config.users[4].agent
            .put('/documents')
            .send({ 
                name: 'exmple'
            })
            .expect(400)
        })
    })
}
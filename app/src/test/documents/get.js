const agent = require('supertest').agent
    , path = require('path')
    , hasProps = require('../helpers/hasProps')
    , DocumentsCollection = require('../../models/DocumentsCollection')

module.exports = function test(config){
    describe(path.parse(__filename).name, ()=>{
        it('owner can get his document', async ()=>{
            const id = config.users[2].documents[0]._id
            const document = await DocumentsCollection.findById(id)
            await config.users[2].agent
            .get(`/documents/${id}`)
            .expect(200)
            .expect(hasProps({
                id: id.toString(),
                content: document.content,
                name: document.name,
                permissions: document.permissions.map(permission=>permission._id.toString())
            }))
        })
        it('partner can get shared document', async ()=>{
            const documentId = config.users[1].shared[0].documentId
            const permissionId = config.users[1].shared[0].permissionId
            const document = await DocumentsCollection.findById(documentId)
            const ownerPermission = await DocumentsCollection.getDocumentOwnerPermission(documentId)
            await config.users[1].agent
            .get(`/documents/${documentId}`)
            .expect(200)
            .expect(hasProps({
                id: document._id.toString(),
                content: document.content,
                name: document.name,
                permissions: [permissionId.toString(), ownerPermission._id.toString()]
            }))
        })
        it('not authenticated users can not get somebodys document', async ()=>{
            const documentId = config.users[1].shared[0].documentId
            await agent(config.app)
            .get(`/documents/${documentId}`)
            .expect(401)
        })
        it('others can not get somebodys document', async ()=>{
            const documentId = config.users[1].shared[0].documentId
            await config.users[3].agent
            .get(`/documents/${documentId}`)
            .expect(404)
        })
        it('admin can get somebodys document', async ()=>{
            const id = config.users[2].documents[0]._id
            const document = await DocumentsCollection.findById(id)
            await config.users[0].agent
            .get(`/documents/${id}`)
            .expect(200)
            .expect(hasProps({
                id: id.toString(),
                content: document.content,
                name: document.name,
                permissions: document.permissions.map(permission=>permission._id.toString())
            }))
        })
    })
}
const agent = require('supertest').agent
    , path = require('path')
    , crypto = require('crypto')
    , should = require('should')
    , hasProps = require('./helpers/hasProps')

function s2b(s){
    return Buffer.from(s).toString('base64')
}

function diffieHelman(prime, generator, privateKey, partnerKey, str){
    const dh = crypto.createDiffieHellman(prime, generator)
    dh.setPrivateKey(s2b(privateKey), 'base64')
    dh.generateKeys('base64')
    const publicKey = dh.getPublicKey('base64')
    if (partnerKey && str){
        return {
            publicKey,
            encoded: encode(str, dh.computeSecret(partnerKey, 'base64'))
        }
    }
    return {
        publicKey
    }
}

function decodeDH(prime, generator, privateKey, partnerKey, str){
    const dh = crypto.createDiffieHellman(prime, generator)
    dh.setPrivateKey(s2b(privateKey), 'base64')
    dh.generateKeys('base64')
    return decode(str, dh.computeSecret(partnerKey, 'base64'))
}

function encode(str, pass){
    const cipher = crypto.createCipher('aes-256-ctr', pass)
    return cipher.update(str, 'utf8', 'hex') + cipher.final('hex')
}

function decode(encoded, pass){
    const decipher = crypto.createDecipher('aes-256-ctr', pass)
    return decipher.update(encoded, 'hex','utf8') + decipher.final('utf8')
}

module.exports = function test(config){
    describe(`Application flow`, ()=>{
        const owner = {}, partner = {}
        it('owner creates an account', async ()=>{
            owner.login = "test1fffffffffgqwv3"
            owner.password = 'f2jfnrfb3ri3bfi'
            const _agent = agent(config.app)
            await _agent
            .put('/auth')
            .send({
                login: owner.login, 
                password: owner.password,
                password_confirmation: owner.password
            })
            .expect(302)
            await _agent
            .get('/users')
            .expect(200)
            owner.agent = _agent
        })
        it('partner creates an account', async ()=>{
            partner.login = "test1e1xfcffc2gqwv3"
            partner.password = 'f2jfnrfb3ri3bfi'
            const _agent = agent(config.app)
            await _agent
            .put('/auth')
            .send({
                login: partner.login,
                password:  partner.password,
                password_confirmation:  partner.password
            })
            .expect(302)
            await _agent
            .get('/users')
            .expect(200)
            partner.agent = _agent
        })
        it('owner encrypt a document', async ()=>{
            owner.document = {}
            owner.document.name = 'test'
            owner.document.content = 'some sensitive text. no 1 can see!'
            owner.document.password = '1234qwer#@'
            owner.document.encoded = encode(owner.document.content, owner.document.password)
            decode(owner.document.encoded, owner.document.password).should.be.equal(owner.document.content)
        })
        it('owner sends an encrypted document', async ()=>{
            let document = await owner.agent
            .put('/documents')
            .send({ 
                name: owner.document.name,
                content: owner.document.encoded
            })
            .expect(200)
            await owner.agent
            .get(`/documents/${document.body.id}`)
            .expect(200)
            .expect(hasProps({
                id: document.body.id.toString(),
                content: owner.document.encoded,
                name: owner.document.name
            }))
        })
        it('owner gets his permission to a document', async ()=>{
            const permissions = await owner.agent
            .get('/permissions')
            .expect(200)
            owner.document.permissionId = permissions.body[0]
        })
        it('owner gets a premission to encrypted document', async ()=>{
            const permission = await owner.agent
            .get(`/permissions/${owner.document.permissionId}`)
            .expect(200)
            owner.document.documentId = permission.body.documentId
        })
        it('owner decrypts his document', async ()=>{
            const document = await owner.agent
            .get(`/documents/${owner.document.documentId}`)
            .expect(200)
            decode(document.body.content, owner.document.password).should.be.equal(owner.document.content)
        })
        it('owner starts to share his document', async ()=>{
            const share = await owner.agent
            .put('/shares')
            .send({ 
                id: owner.document.documentId,
                login: partner.login
            })
            .expect(200)
            owner.shareId = share.body.id.toString()
        })
        it('owner gets his shares', async ()=>{
            const shares = await owner.agent
            .get('/shares')
            .expect(200)
            .expect(hasProps([owner.shareId]))
        })
        it('owner gets a share', async ()=>{
            const share = await owner.agent
            .get(`/shares/${owner.shareId}`)
            .expect(200)
            owner.prime = share.body.prime
            owner.generator = share.body.generator
        })
        it('owner sends his public key', async ()=>{
            owner.privateKey = encode("ownerPrivateKey", "ownerPrivateKey")
            const {publicKey} = diffieHelman(owner.prime, owner.generator, owner.privateKey)
            await owner.agent
            .post(`/shares/${owner.shareId}/0`)
            .send({
                publicKey: publicKey
            })
            .expect(200)
        })
        it('partner gets his shares', async ()=>{
            await partner.agent
            .get('/shares')
            .expect(200)
            .expect(hasProps([owner.shareId]))
            partner.shareId = owner.shareId
        })
        it('partner gets a share', async ()=>{
            const share = await partner.agent
            .get(`/shares/${partner.shareId}`)
            .expect(200)
            partner.prime = share.body.prime
            partner.generator = share.body.generator
        })
        it('partner sends his public key', async ()=>{
            partner.privateKey = encode("partnerPrivateKey", "partnerPrivateKey")
            const {publicKey} = diffieHelman(partner.prime, partner.generator, partner.privateKey)
            await partner.agent
            .post(`/shares/${partner.shareId}/1`)
            .send({
                publicKey: publicKey
            })
            .expect(200)
        })
        it('owner encrypts his password', async ()=>{
            const share = await owner.agent
            .get(`/shares/${owner.shareId}`)
            .expect(200)
            const {publicKey, encoded} = diffieHelman(
                owner.prime, owner.generator, owner.privateKey, 
                share.body.destinationUser.publicKey, owner.document.password
            )
            decodeDH(
                owner.prime, owner.generator, partner.privateKey, publicKey, encoded
            ).should.be.equal(owner.document.password)
            owner.encoded = encoded
        })
        it('owner sends an encrypted password', async ()=>{
            const {publicKey} = diffieHelman(owner.prime, owner.generator, owner.privateKey)
            await owner.agent
            .post(`/shares/${owner.shareId}/2`)
            .send({
                publicKey: publicKey,
                crypted: owner.encoded
            })
            .expect(200)
        })
        it('partner gets an encrypted password', async ()=>{
            const {publicKey} = diffieHelman(partner.prime, partner.generator, partner.privateKey)
            let share = await partner.agent
            .post(`/shares/${partner.shareId}/3`)
            .send({
                publicKey: publicKey
            })
            .expect(200)
            partner.encoded = share.body.crypted
            partner.ownerKey = share.body.originUser.publicKey
        })
        it('partner gets his premissions', async ()=>{
            const permissions = await partner.agent
            .get('/permissions')
            .expect(200)
            partner.document = {}
            partner.document.permissionId = permissions.body[0]
        })
        it('partner gets shared document', async ()=>{
            const permission = await partner.agent
            .get(`/permissions/${partner.document.permissionId}`)
            .expect(200)
            partner.document.documentId = permission.body.documentId
            const document = await partner.agent
            .get(`/documents/${partner.document.documentId}`)
            .expect(200)
            partner.document.encoded = document.body.content
            partner.document.name = document.body.name
        })
        it('partner decrypt an encrypted password', async ()=>{
            partner.document.password = decodeDH(
                partner.prime, partner.generator, partner.privateKey,
                partner.ownerKey, partner.encoded
            )
        })
        it('partner decrypt a shared document', async ()=>{
            partner.document.content = decode(partner.document.encoded, partner.document.password)
        })
        it('users has the same document', async ()=>{
            partner.document.content.should.be.equal(owner.document.content)
        })
        it('owner set a timer for partner', async ()=>{
            const share = await owner.agent
            .get(`/shares/${owner.shareId}`)
            .expect(200)
            await owner.agent
            .put('/timer/permissions')
            .send({
                sec: 3,
                id: share.body.permissionId
            })
            .expect(200)
        })
        it('timer ends', async ()=>{
            return new Promise(res=>setTimeout(res, 5*1000))
        })
        it('partner can no longer access shared document', async ()=>{
            const permissions = await partner.agent
            .get('/permissions')
            .expect(200)
            should(permissions.body[0]).be.equal(undefined)
            await partner.agent
            .get(`/documents/${partner.document.documentId}`)
            .expect(404)
        })
    })
}
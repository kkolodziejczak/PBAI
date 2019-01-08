const agent = require('supertest').agent
    , path = require('path')

module.exports = function test(config){
    describe(path.parse(__filename).name, async ()=>{
        it('user can sign in', async ()=>{
            const _agent = agent(config.app)
            await _agent
            .post('/auth')
            .send({
                login: config.users[4].login, 
                password: config.users[4].password
            })
            .expect(302)
            await _agent
            .get('/users')
            .expect(200)
        })
        it('authenticated user can not sign in', async ()=>{
            await config.users[1].agent
            .post('/auth')
            .send({
                login: config.users[1].login, 
                password: config.users[1].password
            })
            .expect(401)
        })
        it('login is required', async ()=>{
            await agent(config.app)
            .post('/auth')
            .send({ 
                password: config.users[4].password
            })
            .expect(400)
        })
        it('password is required', async ()=>{
            await agent(config.app)
            .post('/auth')
            .send({ 
                login: config.users[4].login
            })
            .expect(400)
        })
    })
}
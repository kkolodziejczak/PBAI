const agent = require('supertest').agent
    , path = require('path')

module.exports = function test(config){
    describe(path.parse(__filename).name, async ()=>{
        it('authenticated user can sign out', async ()=>{
            const _agent = agent(config.app)
            await _agent
            .post('/auth')
            .send({
                login: config.users[4].login, 
                password: config.users[4].password
            })
            .expect(302)
            await _agent
            .delete('/auth')
            .expect(200)
            await _agent
            .get('/users')
            .expect(401)
        })
        it('not authenticated user can not sign out', async ()=>{
            await agent(config.app)
            .delete('/auth')
            .expect(401)
        })
    })
}
const agent = require('supertest').agent
    , path = require('path')
    , hasProps = require('../helpers/hasProps')

module.exports = function test(config){
    describe(path.parse(__filename).name, ()=>{
        it('user can change own informations', async ()=>{
            const login = "NEWlOGNN"
            const password = "afa7tnvasda"
            await config.users[7].agent
            .post(`/users`)
            .send({
                newLogin: login,
                newPassword: password
            })
            .expect(200)
            await agent(config.app)
            .post('/auth')
            .send({
                login, password
            })
            .expect(302)
        })
        it('user can change own password', async ()=>{
            const password = "wfh35ghf5c"
            await config.users[8].agent
            .post(`/users`)
            .send({
                newPassword: password
            })
            .expect(200)
            await agent(config.app)
            .post('/auth')
            .send({
                login: config.users[8].login, password
            })
            .expect(302)
        })
        it('user can change own login', async ()=>{
            const login = "xrtrgrfe"
            await config.users[9].agent
            .post(`/users`)
            .send({
                newLogin: login,
            })
            .expect(200)
            await agent(config.app)
            .post('/auth')
            .send({
                login, password: config.users[9].password
            })
            .expect(302)
        })
        it('admin can change somebodys informations', async ()=>{
            const login = "NEWlOGNN22"
            const password = "7tegxetget5f3"
            await config.users[0].agent
            .post(`/users`)
            .send({
                login: "toBeChangedbyAdmin",
                newLogin: login,
                newPassword: password
            })
            .expect(200)
            await agent(config.app)
            .post('/auth')
            .send({
                login, password
            })
            .expect(302)
        })
        it('admin can not change somebodys informations if he does not exist', async ()=>{
            await config.users[0].agent
            .post(`/users`)
            .send({
                login: "toBeChangasdaedbyAdmin",
                newLogin: 'asdasd'
            })
            .expect(404)
        })
        it('user can not change a login to already taken one', async ()=>{
            await config.users[2].agent
            .post(`/users`)
            .send({
                newLogin: config.users[3].login
            })
            .expect(409)
        })
        it('user can not change somebodys informations', async ()=>{
            await config.users[2].agent
            .post(`/users`)
            .send({
                login: "toBeChangedbyAdmin",
                newLogin: "NEWlOGNN",
                newPassword: "7tnvqwrwerwef"
            })
            .expect(400)
        })
        it('unauthenticated user can not change his informations', async ()=>{
            await agent(config.app)
            .post(`/users`)
            .expect(401)
        })
    })
}
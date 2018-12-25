const agent = require('supertest').agent

    , helper = require('../helper')

module.exports = function test(config){
    describe('out', ()=>{
        describe('get', ()=>{
            it('authenticated user can sign out', ()=>
                helper.signIn(agent(config.express.app), 'username1', 'password')
                .then(agent=>helper.redirect.get(agent, '/sign/out', '/'))
            )
            it('unauthenticated user can not sign out', ()=>
                helper.redirect.get(agent(config.express.app), '/sign/out', '/')
            )
        })
    })
}
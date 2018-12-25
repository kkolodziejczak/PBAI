const agent = require('supertest').agent

    , helper = require('./helper')

module.exports = function test(config){
    describe('app', ()=>{
        it('authenticated user can get an app', ()=>
            helper.signIn(agent(config.express.app), 'username1', 'password')
            .then(agent=>
                helper.checkHTMLTitle(agent, '/app', 'Express app - main'))
        )
        it('unauthenticated user can not get an app', ()=>
            helper.redirect.get(agent(config.express.app), '/app', '/')
        )
        it('user is redirected from root to app', ()=>
            helper.signIn(agent(config.express.app), 'username1', 'password')
                .then(agent=>
                    helper.redirect.get(agent, '/', '/app')
                )
        )
    })
}
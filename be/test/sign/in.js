const agent = require('supertest').agent

    , helper = require('../helper')

module.exports = function test(config){
    describe('in', ()=>{
        describe('post', ()=>{
            it('authenticated user can not sign in', ()=>
                helper.signIn(agent(config.express.app), 'username1', 'password')
                .then(agent=>
                    helper.redirect.post(agent, '/sign/in', {
                        username: 'username1',
                        password: 'password'
                    }, '/')
                )
            )
            it('unauthenticated user can sign in', ()=>
                helper.redirect.post(agent(config.express.app), '/sign/in', {
                    username: 'username1',
                    password: 'password'
                }, '/')
            )
            describe('body validation', ()=>{
                it('username has to be valid', ()=>
                    helper.redirect.post(agent(config.express.app), '/sign/in', {
                        username: 'username',
                        password: 'password'
                    }, '/sign/in')
                )
                it('password has to be valid', ()=>
                    helper.redirect.post(agent(config.express.app), '/sign/in', {
                        username: 'username1',
                        password: 'passwor'
                    }, '/sign/in')
                )
            })
        })
        describe('get', ()=>{
            it('authenticated user can not get sign in page', ()=>
                helper.signIn(agent(config.express.app), 'username1', 'password')
                .then(agent=>helper.redirect.get(agent, '/sign/in', '/'))
            )
            it('unauthenticated user can get sign in page', ()=>
                helper.checkHTMLTitle(agent(config.express.app), '/sign/in', 'Express app - sign in')
            )
        })
    })
}
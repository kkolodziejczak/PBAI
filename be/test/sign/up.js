const agent = require('supertest').agent

    , helper = require('../helper')

module.exports = function test(config){
    describe('up', ()=>{
        describe('post', ()=>{
            it('unauthenticated user can sign up', ()=>
                helper.redirect.post(agent(config.express.app), '/sign/up', {
                    username: 'username1',
                    password: 'password',
                    password2: 'password'
                }, '/')
            )
            it('authenticated user can not sign up', ()=>
                helper.signIn(agent(config.express.app), 'username1', 'password')
                    .then(agent=>
                        helper.redirect.post(agent, '/sign/up', {
                            username: 'username2',
                            password: 'password',
                            password2: 'password'
                        }, '/')
                    )
            )
            describe('body validation', ()=>{
                it('username is required', ()=>
                    helper.redirect.post(agent(config.express.app), '/sign/up', {
                        password: 'password'
                    }, '/sign/up')
                )
                it('username must be not taken yet', ()=>
                    helper.redirect.post(agent(config.express.app), '/sign/up', {
                        username: 'username1',
                        password: 'password',
                        password2: 'password'
                    }, '/sign/up')
                )
                it('password is required', ()=>
                    helper.redirect.post(agent(config.express.app), '/sign/up', {
                        username: 'username'
                    }, '/sign/up')
                )
                it('password and password2 must match', ()=>
                    helper.redirect.post(agent(config.express.app), '/sign/up', {
                        username: 'username',
                        password: 'password',
                        password2: 'password2'
                    }, '/sign/up')
                )
            })
        })
        describe('get', ()=>{
            it('authenticated user can not get an sign up page', ()=>
                helper.signIn(agent(config.express.app), 'username1', 'password')
                .then(agent=>helper.redirect.get(agent, '/sign/up', '/'))
            )
            it('unauthenticated user can get an sign up page', ()=>
                helper.checkHTMLTitle(agent(config.express.app), '/sign/up', 'Express app - sign up')
            )
        })
    })
}
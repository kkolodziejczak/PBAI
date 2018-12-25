const agent = require('supertest').agent

    , helper = require('./helper')

module.exports = function test(config){
    describe('data', ()=>{
        describe('post', ()=>{
            it('authenticated user can post data', ()=>
                helper.signIn(agent(config.express.app), 'username1', 'password')
                .then(agent=>
                    agent
                    .post('/data')
                    .send({text: 'some text'})
                    .expect(200)
                    .expect('content-type', 'application/json; charset=utf-8')
                )
            )
            it('unauthenticated user can not post data', ()=>
                helper.redirect.post(agent(config.express.app), '/data', {text: 'sometext'}, '/')
            )
            describe('body validation', ()=>{
                it('text is required', ()=>
                    helper.signIn(agent(config.express.app), 'username1', 'password')
                    .then(agent=>
                        agent
                        .post('/data')
                        .send({})
                        .expect(422)
                    )
                )
                it('text must be at least 3 chars long', ()=>
                    helper.signIn(agent(config.express.app), 'username1', 'password')
                    .then(agent=>
                        agent
                        .post('/data')
                        .send({text: 'lo'})
                        .expect(422)
                    )
                )
                it('text must not be longer then 100 chars', ()=>
                    helper.signIn(agent(config.express.app), 'username1', 'password')
                    .then(agent=>
                        agent
                        .post('/data')
                        .send({text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. \
                            Aenean commodo ligula eget dolor. Aenean ma'})
                        .expect(422)
                    )
                )
            })
        })
        describe('get', ()=>{
            it('authenticated user can get data', ()=>
                helper.signIn(agent(config.express.app), 'username1', 'password')
                .then(agent=>
                    agent
                    .get('/data')
                    .expect(200)
                    .expect('content-type', 'application/json; charset=utf-8')
                    .expect(['some text'])
                )
            )
            it('unauthenticated user can not get data', ()=>
                helper.redirect.get(agent(config.express.app), '/data', '/')
            )
        })
    })
}
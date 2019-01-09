const agent = require('supertest').agent
    , path = require('path')
    , appConfig = require('../../config')
    , hasProps = require('../helpers/hasProps')

module.exports = function test(config){
    describe(path.parse(__filename).name, async()=>{
        it('user can sign up', async ()=>{
            const _agent = agent(config.app)
            await _agent
            .put('/auth')
            .send({
                login: 'test1gqwv3', 
                password: 'f2jfnrfb3ri3bfi',
                password_confirmation: 'f2jfnrfb3ri3bfi'
            })
            .expect(302)
            await _agent
            .get('/users')
            .expect(200)
        })
        it('authenticated user can not sign up', async ()=>{
            await config.users[1].agent
            .put('/auth')
            .send({
                login: 'test1gq3', 
                password: 'f2jfnrfb3ri3bfi',
                password_confirmation: 'f2jfnrfb3ri3bfi'
            })
            .expect(401)
        })
        it('login must be unique', async ()=>{
            const login = 'test1gadsqwv3'
            await agent(config.app)
            .put('/auth')
            .send({
                login: login, 
                password: 'f2jfnrfb3ri3bfi',
                password_confirmation: 'f2jfnrfb3ri3bfi'
            })
            .expect(302)
            await agent(config.app)
            .put('/auth')
            .send({
                login: login, 
                password: 'f2jfnrfb3ri3bfi',
                password_confirmation: 'f2jfnrfb3ri3bfi'
            })
            .expect(409)
        })
        it('admin account can be created', async ()=>{
            const _agent = agent(config.app)
            await _agent
            .put('/auth')
            .send({
                login: 'teasdst1gasdaq3', 
                password: 'f2jfnrfb3ri3bfi',
                password_confirmation: 'f2jfnrfb3ri3bfi',
                admin: appConfig.ADMIN_SECRET
            })
            .expect(302)
            await _agent
            .get('/users')
            .expect(200)
            .expect(hasProps({
                isAdmin: true
            }))
        })
        it('adminSecret can not be invalid', async ()=>{
            await agent(config.app)
            .put('/auth')
            .send({
                login: 'teaaq3', 
                password: 'f2jfnrfb3ri3bfi',
                password_confirmation: 'f2jfnrfb3ri3bfi',
                admin: appConfig.ADMIN_SECRET+'sanosd'
            })
            .expect(400)
        })
        it('login has to be present', async ()=>{
            await agent(config.app)
            .put('/auth')
            .send({
                password: 'f2jfnrfb3ri3bfi',
                password_confirmation: 'f2jfnrfb3ri3bfi'
            })
            .expect(400)
        })
        it('password has to be present', async ()=>{
            await agent(config.app)
            .put('/auth')
            .send({
                login: 'f2jfnrfb3ri3bfi',
                password_confirmation: 'f2jfnrfb3ri3bfi'
            })
            .expect(400)
        })
        it('password_confirmation has to be present', async()=>{
            await agent(config.app)
            .put('/auth')
            .send({
                login: 'f2jfnrfasacadvb3ri3bfi',
                password: 'f2jfnrfb3ri3bfi'
            })
            .expect(400)
        })
    })
}
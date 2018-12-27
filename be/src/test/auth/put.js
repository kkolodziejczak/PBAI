const agent = require('supertest').agent
    , path = require('path')
    , appConfig = require('../../config')

module.exports = function test(config){
    describe(path.parse(__filename).name, ()=>{
        it('user can sign up', ()=>
            agent(config.app)
            .put('/auth')
            .send({
                login: 'test1gqwv3', 
                password: 'f2jfnrfb3ri3bfi',
                password_confirmation: 'f2jfnrfb3ri3bfi'
            })
            .expect(302)
        )
        it('authenticated user can not sign up', ()=>
            config.users[1].agent
            .put('/auth')
            .send({
                login: 'test1gq3', 
                password: 'f2jfnrfb3ri3bfi',
                password_confirmation: 'f2jfnrfb3ri3bfi'
            })
            .expect(401)
        )
        it('authenticated admin can sign in a new account', ()=>
            config.users[0].agent
            .put('/auth')
            .send({
                login: 'test1adasdccgq3', 
                password: 'f2jfnrfb3ri3bfi',
                password_confirmation: 'f2jfnrfb3ri3bfi'
            })
            .expect(302)
        )
        it('login must be unique', async ()=>{
            await agent(config.app)
            .put('/auth')
            .send({
                login: 'test1gadsqwv3', 
                password: 'f2jfnrfb3ri3bfi',
                password_confirmation: 'f2jfnrfb3ri3bfi'
            })
            .expect(302)
            return await agent(config.app)
            .put('/auth')
            .send({
                login: 'test1gadsqwv3', 
                password: 'f2jfnrfb3ri3bfi',
                password_confirmation: 'f2jfnrfb3ri3bfi'
            })
            .expect(409)
        })
        it('admin account can be created', ()=>
            agent(config.app)
            .put('/auth')
            .send({
                login: 'teasdst1gasdaq3', 
                password: 'f2jfnrfb3ri3bfi',
                password_confirmation: 'f2jfnrfb3ri3bfi',
                admin: appConfig.ADMIN_SECRET
            })
            .expect(302)
        )
        it('adminSecret can not be invalid', ()=>
            agent(config.app)
            .put('/auth')
            .send({
                login: 'teaaq3', 
                password: 'f2jfnrfb3ri3bfi',
                password_confirmation: 'f2jfnrfb3ri3bfi',
                admin: appConfig.ADMIN_SECRET+'sanosd'
            })
            .expect(400)
        )
        it('login has to be present', ()=>
            agent(config.app)
            .put('/auth')
            .send({
                password: 'f2jfnrfb3ri3bfi',
                password_confirmation: 'f2jfnrfb3ri3bfi'
            })
            .expect(400)
        )
        it('password has to be present', ()=>
            agent(config.app)
            .put('/auth')
            .send({
                login: 'f2jfnrfb3ri3bfi',
                password_confirmation: 'f2jfnrfb3ri3bfi'
            })
            .expect(400)
        )
        it('password_confirmation has to be present', ()=>
            agent(config.app)
            .put('/auth')
            .send({
                login: 'f2jfnrfasacadvb3ri3bfi',
                password: 'f2jfnrfb3ri3bfi'
            })
            .expect(400)
        )
    })
}
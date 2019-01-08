const agent = require('supertest').agent
    , path = require('path')
    , hasProps = require('./helpers/hasProps')
    , SharesCollection = require('../models/SharesCollection')

module.exports = function test(config){
    describe(path.parse(__filename).name, ()=>{
        it('share partner can not set a timer', async ()=>{
            await config.users[17].agent
            .put('/timer/permissions')
            .send({
                sec: 3,
                id: config.users[18].shares[0].permissionId.toString()
            })
            .expect(404)
        })
        it('document owner can set a timer', async ()=>{
            const timer = await config.users[18].agent
            .put('/timer/permissions')
            .send({
                sec: 3,
                id: config.users[18].shares[0].permissionId.toString()
            })
            .expect(200)
            config.users[18].timerId = timer.body.id.toString()
        })
        it('document owner can get a timer and timer is attached to a premission', async()=>{
            await config.users[18].agent
            .get(`/timer/permissions/${config.users[18].timerId}`)
            .expect(200)
            .expect(hasProps({
                id: config.users[18].timerId.toString()
            }))
            const permissionId = config.users[18].shares[0].permissionId.toString()
            await config.users[18].agent
            .get(`/permissions/${permissionId}`)
            .expect(200)
            .expect(hasProps({
                id: permissionId,
                timer: config.users[18].timerId
            }))
        })
        it('share partner can get a timer', async()=>{
            const permissionId = config.users[18].shares[0].permissionId.toString()
            const permission = await config.users[17].agent
            .get(`/permissions/${permissionId}`)
            .expect(200)
            permission.body.should.have.property('timer', config.users[18].timerId)
            await config.users[17].agent
            .get(`/timer/permissions/${permission.body.timer}`)
            .expect(200)
            .expect(hasProps({
                id: config.users[18].timerId.toString()
            }))
        })
        it('share partner can not delete a timer', async()=>{
            await config.users[17].agent
            .delete(`/timer/permissions`)
            .send({
                id: config.users[18].timerId
            })
            .expect(404)
        })
        it('document owner can delete a timer', async()=>{
            await config.users[18].agent
            .delete(`/timer/permissions`)
            .send({
                id: config.users[18].timerId
            })
            .expect(200)
        })
        it('document owner can not get a deleted timer and timer is deleted from a premission', async()=>{
            await config.users[18].agent
            .get(`/timer/permissions/${config.users[18].timerId}`)
            .expect(404)
            const permissionId = config.users[18].shares[0].permissionId.toString()
            const permission = await config.users[18].agent
            .get(`/permissions/${permissionId}`)
            .expect(200)
            permission.body.should.not.have.property('timer')
        })
        it('deleted timer does not trigger', async()=>{
            await new Promise(r=>setTimeout(r,4000))
            await config.users[18].agent
            .get(`/permissions/${config.users[18].shares[0].permissionId.toString()}`)
            .expect(200)
        })
        it('document owner can set a timer again', async ()=>{
            const timer = await config.users[18].agent
            .put('/timer/permissions')
            .send({
                sec: 3,
                id: config.users[18].shares[0].permissionId.toString()
            })
            .expect(200)
            config.users[18].timerId = timer.body.id.toString()
        })
        it('after the time timer triggers and delete itselv and a premission', async()=>{
            await new Promise(r=>setTimeout(r,4000))
            await config.users[18].agent
            .get(`/timer/permissions/${config.users[18].timerId}`)
            .expect(404)
            await config.users[18].agent
            .get(`/permissions/${config.users[18].shares[0].permissionId.toString()}`)
            .expect(404)
        })
        it('share partner can no longer get a premission', async()=>{
            await config.users[17].agent
            .get(`/permissions/${config.users[18].shares[0].permissionId.toString()}`)
            .expect(404)
        })
        it('admin can set a timer', async ()=>{
            const timer = await config.users[0].agent
            .put('/timer/permissions')
            .send({
                sec: 3,
                id: config.users[18].shares[1].permissionId.toString()
            })
            .expect(200)
            config.users[0].timerId = timer.body.id.toString()
        })
        it('admin can get a timer', async ()=>{
            await config.users[0].agent
            .get(`/timer/permissions/${config.users[0].timerId}`)
            .expect(200)
            .expect(hasProps({
                id: config.users[0].timerId.toString()
            }))
        })
        it('admin can delete a timer', async()=>{
            await config.users[0].agent
            .delete(`/timer/permissions`)
            .send({
                id: config.users[0].timerId
            })
            .expect(200)
        })
    })
}
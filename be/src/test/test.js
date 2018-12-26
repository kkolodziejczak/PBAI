process.env.NODE_ENV = 'test'

const mongoose = require('mongoose')
    , app = require('../app')
    , auth = require('./auth')
    , documents = require('./documents')
    , logs = require('./logs')
    , permissions = require('./permissions')
    , shares = require('./shares')
    , timer = require('./timer')
    , users = require('./users')
    , populate = require('./populate')
    , config = {}

function ensureConnection() {
    return new Promise(res=>{
        const mc = mongoose.connection
        mc.on('open',()=>res(mc.db))
        mc.db && res(mc.db)
    })
}

function cleanDatabase() {
    return new Promise(res=>mongoose.connection.db.dropDatabase(res))
}

function closeServer(server){
    return new Promise(res=>{
        server.close(res)
        setTimeout(()=>{
            res(process.exit(0))
        }, 5000)
    })    
}

describe('Testing service', ()=>{
    before(async ()=>{
        const express = await app()
        config.server = express.server
        config.app = express.app
        await ensureConnection()
        await cleanDatabase()
        config.users = await populate()
    })

    auth(config)
    documents(config)
    logs(config)
    permissions(config)
    shares(config)
    timer(config)
    users(config)

    after(async ()=>{
        await cleanDatabase()
        await closeServer(config.server)    
    })
})
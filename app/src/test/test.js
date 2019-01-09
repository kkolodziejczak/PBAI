process.env.NODE_ENV = 'test'

const mongoose = require('mongoose')
    , app = require('../app')
    , populate = require('./helpers/populate')
    , getLocalTests = require('./helpers/getLocalTests')
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

describe('Testing service', ()=>{
    before(async ()=>{
        await ensureConnection()
        await cleanDatabase()
        const express = await app()
        config.server = express.server
        config.app = express.app
        config.close = express.close
        config.users = await populate(config.app)
    })

    getLocalTests(config, __filename, [
        'helpers', 
        //'auth', 
        //'documents', 
        //'permissions', 
        //'users',
        //'flow.js',
        //'logs.js',
        //'timer.js'
    ])

    after(async ()=>{
        await cleanDatabase()
        config.server.close()    
    })
})
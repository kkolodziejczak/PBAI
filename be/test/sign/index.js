const signIn = require('./in')
    , signUp = require('./up')
    , signOut = require('./out')

module.exports = function test(config){
    describe('sign', ()=>{
        signUp(config)
        signIn(config)
        signOut(config)
    })
}
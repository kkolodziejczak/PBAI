const LocalStrategy = require('passport-local').Strategy
    , passport = require('passport')
    , UsersCollection = require('../models/UsersCollection')
    , log = require('../helpers/log')
    , config = require('../config')
    , httpStatuses = require('http-status-codes')

// klasa LoginManager

passport.serializeUser((user, done)=>done(null, user.id))

passport.deserializeUser( async function(id, done) {
    try{
        done(undefined, await UsersCollection.findById(id))
    }
    catch(err){
        done(err, undefined)
    }
})

passport.use('registration', new LocalStrategy({
    passReqToCallback : true,
    usernameField:"login", 
    passwordField:"password"
}, async function registerUser(req, login, password, done) {
    log.trace("Creating a new user:", login)
    try{
        const newUser = await UsersCollection.createNew(login, password, req.body.admin)
        log.trace("User created:", login)
        return done(null, newUser)
    }
    catch(err){
        if (err.codeName === "ImmutableField"){
            return done(null, false, httpStatuses.CONFLICT)
        }
        log.trace("Creating error:", err)
        return done(null, false)
    }
}))

passport.use('authorization', new LocalStrategy({
    passReqToCallback : true,
    usernameField:"login", 
    passwordField:"password"
}, async function loginUser(req, login, password, done) {
    log.trace("Authentication user:", login)
    try{
        return done(null, await UsersCollection.findAndValidate(login, password) || false)
    }
    catch(err){
        log.error("Authentication error:", err)
        return done(err)
    }
}))

module.exports = passport
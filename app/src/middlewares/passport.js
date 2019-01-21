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
    try{
        const newUser = await UsersCollection.createNew(login, password, req.body.admin)
        req.session.logger("User created:", login)
        return done(null, newUser)
    }
    catch(err){
        if (err.codeName === "ImmutableField"){
            req.session.logger("Creating error: Login is already taken")
            return done(null, false, httpStatuses.CONFLICT)
        }
        
        req.session.logger("Creating error:", err.message)
        return done(null, false)
    }
}))

passport.use('authorization', new LocalStrategy({
    passReqToCallback : true,
    usernameField:"login", 
    passwordField:"password"
}, async function loginUser(req, login, password, done) {
    try{
        const auth = await UsersCollection.findAndValidate(login, password)
        req.session.logger(auth ? `Authorization ok` : `Authorization failure`)
        auth && req.session.resetPostAuthLimiter()
        return done(null, auth || false)
    }
    catch(err){
        req.session.logger("Authentication error:", err)
        return done(err)
    }
}))

module.exports = passport
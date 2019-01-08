const crateRouter = require('../helpers/createRouter')
    , authenticated = require('../policies/authenticated')
    , notAuthenticated = require('../policies/notAuthenticated')
    , validJoiScheme = require('../validators/validJoiScheme')
    , checkBlackListedPasswords = require('../validators/checkBlackListedPasswords')
    , schemes = require('../models/shemes')

module.exports = app => {
    return crateRouter([{
        policy: authenticated,
        route: '/done',
        handler: function done(req, res, next){
            return res.end()
        }
    }, {
        method: "put",
        policy: notAuthenticated,
        validation: [
            validJoiScheme({
                login: schemes.login,
                password: schemes.password,
                password_confirmation: schemes.password_confirmation,
                admin: schemes.isAdmin
            }, 'body'), 
            checkBlackListedPasswords
        ], 
        handler: function registration(req, res, next){
            return app.passport.authenticate('registration', {
                successRedirect : '/auth/done'
            })(req, res, next)
        }
    }, {
        method: "post",
        policy: notAuthenticated,
        validation: validJoiScheme({
            login: schemes.login,
            password: schemes.password,
        }, 'body'),
        handler: function authorization(req, res, next){
            return app.passport.authenticate('authorization', {
                successRedirect : '/auth/done'
            })(req, res, next)
        }
    }, {
        method: "delete",
        policy: authenticated,
        handler: function deAuthorization(req, res, next){
            req.logout()
            req.session.logger('Logged out')
            return res.end()
        }
    }])
}
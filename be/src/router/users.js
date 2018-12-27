const crateRouter = require('../helpers/createRouter')
    , authenticated = require('../policies/authenticated')
    , noAccess = require('../policies/noAccess')
    , validJoiScheme = require('../validators/validJoiScheme')
    , schemes = require('../models/shemes')
    , UsersCollection = require('../models/UsersCollection')
    , httpStatuses = require('http-status-codes')

module.exports = app => {
    return crateRouter([{
        method: "get",
        policy: authenticated,
        handler: async function getUserInfo(req, res){
            const user = await UsersCollection.findById(req.user._id)
            return res.json({
                login: user.login,
                isAdmin: user.isAdmin,
                permissions: user.permissions,
                shares: user.shares
            })
        }
    }, {
        method: "post",
        policy: authenticated,
        validation: [
            validJoiScheme({
                login: schemes.loginNotRequired,
                newLogin: schemes.loginNotRequired,
                newPassword: schemes.passwordNotRequired
            }, 'body'), 
            function ifIdPresentMustBeAdmin(req, res){
                if (req.body.login && !req.user.isAdmin){
                    return [`"\"login\" is not allowed"`]
                }
            },
        ], 
        handler: async function changeUserInfo(req, res, next){
            if (!req.body.newLogin && !req.body.newPassword){
                return res.sendStatus(httpStatuses.BAD_REQUEST)
            }
            const update = {}
            if (req.body.newLogin){
                if (await UsersCollection.findOne({login: req.body.newLogin})){
                    return res.sendStatus(httpStatuses.CONFLICT)
                }
                update.login = req.body.newLogin 
            }
            if (req.body.newPassword){
                update.password = req.user.generateHash(req.body.newPassword)
            }
            if(!await UsersCollection.findOneAndUpdate({
                login: req.body.login || req.user.login
            }, update)){
                return res.sendStatus(httpStatuses.NOT_FOUND)
            }
            if (!req.body.login){
                req.user = {...req.user, ...update}
            }
            return res.end()
        }
    }, {
        method: "delete",
        policy: noAccess,
        validation: validJoiScheme({
            login: schemes.login
        }, 'body'),
        handler: async function authorization(req, res, next){
            const user = await UsersCollection.deleteUser({login: req.body.login})
            if (!user){
                return res.sendStatus(httpStatuses.NOT_FOUND)
            }
            if (req.body.login === req.user.login){
                return res.redirect('/auth')
            }
            return res.end()
        }
    }])
}
const crateRouter = require('../helpers/createRouter')
    , authenticated = require('../policies/authenticated')
    , noAccess = require('../policies/noAccess')
    , validJoiScheme = require('../validators/validJoiScheme')
    , schemes = require('../models/shemes')
    , UsersCollection = require('../models/UsersCollection')

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
            const update = {}
            if (req.body.newLogin){
                update.login = req.body.newLogin 
            }
            if (req.body.newPassword){
                update.password = req.user.generateHash(req.body.newPassword)
            }
            if (Object.keys(update).length){
                await UsersCollection.findOneAndUpdate({
                    login: req.body.login || req.user.login
                }, update)
            }
            req.user = {...user, ...update}
            return res.end()
        }
    }, {
        method: "delete",
        policy: noAccess,
        validation: validJoiScheme({
            login: schemes.login
        }, 'body'),
        handler: async function authorization(req, res, next){
            await UsersCollection.deleteUser({login: req.body.login})
            if (req.body.login === req.user.login){
                return res.redirect('/auth')
            }
            return res.end()
        }
    }])
}
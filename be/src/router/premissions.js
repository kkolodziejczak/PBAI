const crateRouter = require('../helpers/createRouter')
    , authenticated = require('../policies/authenticated')
    , canReadPremission = require('../policies/canReadPremission')
    , hasOwnerPremission = require('../policies/hasOwnerPremission')
    , validJoiScheme = require('../validators/validJoiScheme')
    , schemes = require('../models/shemes')
    , PermissionsCollection = require('../models/PermissionsCollection')
    , permissionTypes = Object(require('../assets/permissionsTypes.json'))
    , UsersCollection = require('../models/UsersCollection')
    , httpStatuses = require('http-status-codes')

module.exports = app => {
    return crateRouter([{
        method: "delete",
        policy: [authenticated, hasOwnerPremission],
        validation: validJoiScheme({
            id: schemes.id
        }, 'body'),
        handler: async function putDocument(req, res, next){
            await PermissionsCollection.deletePermission(req.body.id)
            return res.end()
        }
    }, {
        route: "/:id?",
        method: "get",
        policy: [authenticated, canReadPremission],
        validation: validJoiScheme({
            id: schemes.idNotRequied
        }, 'params'),
        handler: async function getPremissions(req, res, next){
            if (req.params.id){
                const permission = req.body.permission || await PermissionsCollection.findById(id)
                if (!permission){
                    return res.sendStatus(httpStatuses.NOT_FOUND)
                }
                return res.json(permission)
            }
            if (!req.user.isAdmin){
                const user = await UsersCollection.findById(req.user._id)
                return res.json(user.permissions)
            }
            return res.json(await PermissionsCollection.find({type: permissionTypes.owner}))
        }
    }])
}
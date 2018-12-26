const crateRouter = require('../helpers/createRouter')
    , authenticated = require('../policies/authenticated')
    , canReadPermission = require('../policies/canReadPermission')
    , hasOwnerPermission = require('../policies/hasOwnerPermission')
    , validJoiScheme = require('../validators/validJoiScheme')
    , schemes = require('../models/shemes')
    , PermissionsCollection = require('../models/PermissionsCollection')
    , SharesCollection = require('../models/SharesCollection')
    , permissionTypes = Object(require('../assets/permissionsTypes.json'))
    , UsersCollection = require('../models/UsersCollection')
    , httpStatuses = require('http-status-codes')

module.exports = app => {
    return crateRouter([{
        method: "delete",
        policy: [authenticated, hasOwnerPermission],
        validation: validJoiScheme({
            id: schemes.id
        }, 'body'),
        handler: async function putDocument(req, res, next){
            const permission = PermissionsCollection.findById(req.body.id)
            if (!permission){
                return res.sendStatus(httpStatuses.BAD_REQUEST)
            }
            if (permission.type==="o"){
                await PermissionsCollection.deletePermission(req.body.id)
                return res.end()
            }
            const share = await SharesCollection.find({permissionId: req.body.id})
            if (!share){
                return res.sendStatus(httpStatuses.BAD_REQUEST)
            }
            await SharesCollection.deleteShare(share._id, req.user._id)
            return res.end()
        }
    }, {
        route: "/:id?",
        method: "get",
        policy: [authenticated, canReadPermission],
        validation: validJoiScheme({
            id: schemes.idNotRequied
        }, 'params'),
        handler: async function getPermissions(req, res, next){
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
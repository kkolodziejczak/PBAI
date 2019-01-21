const crateRouter = require('../helpers/createRouter')
    , authenticated = require('../policies/authenticated')
    , canReadPermission = require('../policies/canReadPermission')
    , hasOwnerPermission = require('../policies/hasOwnerPermission')
    , validJoiScheme = require('../validators/validJoiScheme')
    , schemes = require('../models/shemes')
    , PermissionsCollection = require('../models/PermissionsCollection')
    , DocumentsCollection = require('../models/DocumentsCollection')
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
        handler: async function deletePermission(req, res, next){
            try{
                const permission = await PermissionsCollection.findById(req.body.id)
                if (!permission){
                    throw new Error()
                }
                let userId = req.user._id
                if (req.user.isAdmin){
                    const ownerPermission = await DocumentsCollection.getDocumentOwnerPermission(permission.documentId)
                    userId = ownerPermission.userId
                }
                await PermissionsCollection.deletePermission(req.body.id, userId)
                req.session.logger(`permission deleted (id: ${req.body.id})`)
                return res.end()
            }
            catch(e){
                req.session.logger(`invalid permission id`)
                return res.sendStatus(httpStatuses.BAD_REQUEST)
            }
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
                try{
                    const permission = req.body.permission || await PermissionsCollection.findById(req.params.id)
                    if (!permission){
                        throw new Error()
                    }
                    req.session.logger(`permission sent (id: ${permission._id})`)
                    return res.json({
                        id: permission._id.toString(),
                        userId: permission.userId.toString(),
                        documentId: permission.documentId.toString(),
                        shareId: permission.shareId ? permission.shareId.toString() : undefined,
                        type: permission.type,
                        timer: permission.timer ? permission.timer.toString() : undefined
                    })
                }
                catch(e){
                    req.session.logger(`invalid permission id`)
                    return res.sendStatus(httpStatuses.NOT_FOUND)
                }
            }
            if (!req.user.isAdmin){
                const user = await UsersCollection.findById(req.user._id)
                return res.json(user.permissions)
            }
            const allPermissions = await PermissionsCollection.find({type: permissionTypes.owner})
            return res.json(allPermissions.map(e=>e._id.toString()))
        }
    }])
}
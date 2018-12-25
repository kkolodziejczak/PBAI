const crateRouter = require('../helpers/createRouter')
    , authenticated = require('../policies/authenticated')
    , canReadDocument = require('../policies/canReadDocument')
    , validJoiScheme = require('../validators/validJoiScheme')
    , schemes = require('../models/shemes')
    , DocumentsCollection = require('../models/DocumentsCollection')
    , log = require('../helpers/log')
    , httpStatuses = require('http-status-codes')
    , permissionTypes = Object(require('../assets/permissionsTypes.json'))

module.exports = app => {
    return crateRouter([{
        method: "put",
        policy: authenticated,
        validation: validJoiScheme({
            content: schemes.documentContent,
            name: schemes.documentName
        }, 'body'),
        handler: async function putDocument(req, res, next){
            const document = await DocumentsCollection.createNew(
                req.user._id, req.body.name, req.body.content
            )
            return res.json({id: document._id})
        }
    }, {
        route: "/:id",
        method: "get",
        policy: [authenticated, canReadDocument],
        validation: validJoiScheme({
            id: schemes.id
        }, 'params'),
        handler: async function getDocument(req, res, next){
            const document = await DocumentsCollection.findById(req.params.id)
            if (!document){
                return res.sendStatus(httpStatuses.NOT_FOUND)
            }
            if (!req.user.isAdmin && req.body.permission && req.body.permission.type !== permissionTypes.owner){
                const myPermission = req.body.permission || await DocumentsCollection.getUsersPermissionsToDocument(req.params.id, req.user._id)
                const owner = await DocumentsCollection.getDocumentOwnerPermission(req.params.id)
                document.permissions = [myPermission, owner].filter(p=>p!==undefined).map(p=>p._id)
            }
            return res.json(document)
        }
    }])
}
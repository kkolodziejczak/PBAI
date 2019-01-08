const crateRouter = require('../../helpers/createRouter')
    , validJoiScheme = require('../../validators/validJoiScheme')
    , schemes = require('../../models/shemes')
    , hasOwnerPermission = require('../../policies/hasOwnerPermission')
    , authenticated = require('../../policies/authenticated')
    , canReadTimerPermission = require('../../policies/canReadTimerPermission')
    , canDeleteTimerPermission = require('../../policies/canDeleteTimerPermission')
    , config = require('../../config')
    , TimersCollection = require('../../models/TimersCollection')
    , PermissionsCollection = require('../../models/PermissionsCollection')
    , DocumentsCollection = require('../../models/DocumentsCollection')
    , httpStatuses = require('http-status-codes')

module.exports = app => {
    return crateRouter([{
        method: 'put',
        validation: validJoiScheme({
            id: schemes.id,
            sec: schemes.sec
        }, 'body'),
        policy: [authenticated, hasOwnerPermission],
        handler: async function setPermissionTimer(req, res){
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
                try {
                    const timer = await TimersCollection.createNew(
                        'deletePermission', {id:req.body.id, userId}, req.body.sec*1000, 
                        req.body.id, config.PERMISSIONS_DATABASE_NAME
                    )
                    timer.invokeOnTime(app.eventEmitter)
                    req.session.logger(`timer set (id:${timer._id})`)
                    return res.json({
                        id: timer._id.toString()
                    })
                }
                catch(err){
                    if (err === TimersCollection.timerAlreadyExistsError){
                        req.session.logger(`permission already has timer set up`)
                        return res.sendStatus(httpStatuses.CONFLICT)
                    }
                    throw err
                }
            }
            catch(e){
                req.session.logger(`invalid permission id`)
                return res.sendStatus(httpStatuses.NOT_FOUND)
            }
        }
    }, {
        route: '/:id',
        method: "get",
        validation: validJoiScheme({
            id: schemes.id,
        }, 'params'),
        policy: [authenticated, canReadTimerPermission],
        handler: async function getPermission(req, res){
            try{
                const timer = await TimersCollection.findById(req.params.id)
                if (!timer){
                    throw new Error()
                }
                req.session.logger(`timer (id: ${timer._id}) sent`)
                return res.json({
                    id: timer._id.toString(),
                    type: timer.type,
                    params: timer.params,
                    when: timer.when,
                    object: timer.object,
                    objectModelName: timer.objectModelName
                })
            }
            catch(e){
                req.session.logger(`invalid permission id`)
                return res.sendStatus(httpStatuses.NOT_FOUND)
            }
        }
    }, {
        method: "delete",
        validation: validJoiScheme({
            id: schemes.id,
        }, 'body'),
        policy: [authenticated, canDeleteTimerPermission],
        handler: async function getPermission(req, res){
            try{
                const timer = await TimersCollection.findById(req.body.id)
                if (!timer){
                    throw new Error()
                }
                await TimersCollection.deleteTimer(timer._id)
                req.session.logger(`timer (id: ${timer._id}) deleted`)
                return res.end()
            }
            catch(e){
                req.session.logger(`invalid permission id`)
                return res.sendStatus(httpStatuses.NOT_FOUND)
            }
        }
    }])
}
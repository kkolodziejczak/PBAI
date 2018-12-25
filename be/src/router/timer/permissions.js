const crateRouter = require('../../helpers/createRouter')
    , validJoiScheme = require('../../validators/validJoiScheme')
    , schemes = require('../../models/shemes')
    , hasOwnerPremission = require('../../policies/hasOwnerPremission')
    , authenticated = require('../../policies/authenticated')
    , canReadTimerPermission = require('../../policies/canReadTimerPermission')
    , canDeleteTimerPermission = require('../../policies/canDeleteTimerPermission')
    , config = require('../../config')
    , TimersCollection = require('../../models/TimersCollection')
    , httpStatuses = require('http-status-codes')

module.exports = app => {
    return crateRouter([{
        method: 'put',
        validation: validJoiScheme({
            id: schemes.id,
            sec: schemes.sec
        }, 'body'),
        policy: [authenticated, hasOwnerPremission],
        handler: async function setPermissionTimer(req, res){
            const id = req.body.id
            try {
                const timer = await TimersCollection.createNew(
                    'deletePermission', {id}, req.body.sec*1000, 
                    id, config.PERMISSIONS_DATABASE_NAME
                )
                timer.invokeOnTime(app.eventEmitter)
                return res.json(timer)
            }
            catch(err){
                if (err === TimersCollection.timerAlreadyExistsError){
                    return res.sendStatus(httpStatuses.CONFLICT)
                }
                throw err
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
            const timer = req.body.timer || await TimersCollection.findById(req.body.id)
            if (!timer){
                return res.sendStatus(httpStatuses.NOT_FOUND)
            }
            return res.json(timer)
        }
    }, {
        method: "delete",
        validation: validJoiScheme({
            id: schemes.id,
        }, 'body'),
        policy: [authenticated, canDeleteTimerPermission],
        handler: async function getPermission(req, res){
            const timer = req.body.timer || await TimersCollection.findById(req.body.id)
            if (!timer){
                return res.sendStatus(httpStatuses.NOT_FOUND)
            }
            await TimersCollection.deleteTimer(timer._id)
            return res.end()
        }
    }])
}
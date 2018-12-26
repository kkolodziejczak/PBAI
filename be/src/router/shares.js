const path = require('path')
    , crateRouter = require('../helpers/createRouter')
    , authenticated = require('../policies/authenticated')
    , shareIncluded = require('../policies/shareIncluded')
    , shareDestination = require('../policies/shareDestination')
    , shareOrigin = require('../policies/shareOrigin')
    , documentOwner = require('../policies/documentOwner')
    , validJoiScheme = require('../validators/validJoiScheme')
    , schemes = require('../models/shemes')
    , SharesCollection = require('../models/SharesCollection')
    , UsersCollection = require('../models/UsersCollection')
    , PermissionsCollection = require('../models/PermissionsCollection')
    , httpStatuses = require('http-status-codes')
    , permissionTypes = Object(require('../assets/permissionsTypes.json'))

module.exports = app => {
    return crateRouter([{
        method: "get",
        route: "/:id?",
        policy: [authenticated, shareIncluded],
        validation: validJoiScheme({
            id: schemes.idNotRequied
        }, 'params'),
        handler: async function(req, res, next){
            if (req.params.id){
                const share = req.body.share || await SharesCollection.findById(req.params.id)
                if (!share){
                    return res.sendStatus(httpStatuses.NOT_FOUND)
                }
                share.crypted = null
                return res.json(share)
            }
            if (!req.user.isAdmin){
                const user = await UsersCollection.findById(req.user._id)
                return res.json(user.shares)
            }
            const shares = await SharesCollection.find({})
            return res.json(shares.map(s=>s._id))
        }
    }, {
        method: "delete",
        policy: [authenticated, shareIncluded],
        validation: validJoiScheme({
            id: schemes.id
        }, 'body'),
        handler: async function(req, res, next){
            if (!req.user.isAdmin){
                await SharesCollection.deleteShare(req.body.id, req.user._id)
            } else {
                await SharesCollection.deleteShare(req.body.id)
            }
            return res.end()
        }
    }, {
        method: "put",
        policy: [authenticated, documentOwner],
        validation: [validJoiScheme({
            id: schemes.id,
            login: schemes.login
        }, 'body'), async function loginIsUser(req, res){
            let loginUser = await UsersCollection.find({login: req.body.login})
            if (loginUser.length === 0){
                return httpStatuses.BAD_REQUEST
            }
            req.body.loginUser = loginUser[0]
        }],
        handler: async function(req, res, next){
            const loginUser = req.body.loginUser || (await UsersCollection.find({login: req.body.login}))[0]
            if (!loginUser){
                return httpStatuses.BAD_REQUEST
            }
            try {
                return res.json(await SharesCollection.createNew(
                    req.user._id, loginUser._id, req.body.id)
                )
            }
            catch (err){
                return res.sendStatus(httpStatuses.BAD_REQUEST)
            }
        }
    }, {
        method: 'post',
        route: "/:id",
        policy: [authenticated, shareIncluded],
        validation: validJoiScheme({
            id: schemes.id
        }, 'params'),
        handler: async function(req, res, next){
            const share = req.body.share || await SharesCollection.findById(req.params.id)
            if (!share || share.state === -1){
                return res.sendState(httpStatuses.NOT_FOUND)
            }
            return res.redirect(307, `/${path.basename(__filename).split('.')[0]}/${req.params.id}/${share.state}`)
        }
    }, {
        method: 'post',
        route: "/:id/0",
        policy: [authenticated, shareOrigin],
        validation: [validJoiScheme({
            publicKey: schemes.publicKey
        }, 'body'), validJoiScheme({
            id: schemes.id
        }, 'params')],
        handler: async function handlerStatus0(req, res){
            const share = req.body.share || await SharesCollection.findById(req.params.id)
            if (!share || share.state !== 0){
                return res.sendState(httpStatuses.NOT_FOUND)
            }
            share.originUser.publicKey = req.body.publicKey
            share.state = 1
            await share.save()
            res.end()
        }
    }, {
        method: 'post',
        route: "/:id/1",
        policy: [authenticated, shareDestination],
        validation: [validJoiScheme({
            publicKey: schemes.publicKey
        }, 'body'), validJoiScheme({
            id: schemes.id
        }, 'params')],
        handler: async function handlerStatus1(req, res){
            const share = req.body.share || await SharesCollection.findById(req.params.id)
            if (!share || share.state !== 1){
                return res.sendState(httpStatuses.NOT_FOUND)
            }
            share.destinationUser.publicKey = req.body.publicKey
            share.state = 2
            await share.save()
            res.end()
        }
    }, {
        method: 'post',
        route: "/:id/2",
        policy: [authenticated, shareOrigin],
        validation: [validJoiScheme({
            publicKey: schemes.publicKey,
            crypted: schemes.crypted
        }, 'body'), validJoiScheme({
            id: schemes.id
        }, 'params')],
        handler: async function handlerStatus2(req, res){
            const share = req.body.share || await SharesCollection.findById(req.params.id)
            if (!share || share.state !== 2){
                return res.sendState(httpStatuses.NOT_FOUND)
            }
            if (share.originUser.publicKey !== req.body.publicKey){
                return res.sendState(httpStatuses.BAD_REQUEST)
            }
            share.crypted = req.body.crypted
            share.state = 3
            await share.save()
            res.end()
        }
    }, {
        method: 'post',
        route: "/:id/3",
        policy: [authenticated, shareDestination],
        validation: [validJoiScheme({
            publicKey: schemes.publicKey
        }, 'body'), validJoiScheme({
            id: schemes.id
        }, 'params')],
        handler: async function handlerStatus3(req, res){
            const share = req.body.share || await SharesCollection.findById(req.params.id)
            if (!share || share.state !== 3){
                return res.sendState(httpStatuses.NOT_FOUND)
            }
            if (share.destinationUser.publicKey !== req.body.publicKey){
                return res.sendState(httpStatuses.BAD_REQUEST)
            }
            if (!share.permissionId){
                share.permissionId = await PermissionsCollection.createNew(
                    req.user._id, share.documentId, permissionTypes.reader
                )
                share.save()
            }
            res.json({
                permissionId: share.permissionId,
                crypted: share.crypted
            })
        }
    }])
}
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
    , DocumentsCollection = require('../models/DocumentsCollection')
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
            try{
                if (req.params.id){
                    const share = req.body.share || await SharesCollection.findById(req.params.id)
                    if (!share){
                        throw new Error()
                    }
                    req.session.logger(`sending share info (id: ${req.params.id})`)
                    return res.json({
                        id: share._id.toString(),
                        destinationUser: share.destinationUser,
                        originUser: share.originUser,
                        crypted: null,
                        prime: share.prime,
                        generator: share.generator,
                        documentId: share.documentId.toString(),
                        isOwner: ((share.originUser||{}).id||"").toString()===req.user._id.toString(),
                        permissionId: share.permissionId ? share.permissionId.toString() : null,
                        state: share.state
                    })
                }
                if (!req.user.isAdmin){
                    const user = await UsersCollection.findById(req.user._id)
                    req.session.logger(`sending user shares info`)
                    return res.json(user.shares.map(s=>s._id.toString()))
                }
                const shares = await SharesCollection.find({})
                req.session.logger(`sending all shares info`)
                return res.json(shares.map(s=>s._id.toString()))
            }
            catch(e){
                req.session.logger(`invalid share id`)
                return res.sendStatus(httpStatuses.NOT_FOUND)
            }
        }
    }, {
        method: "delete",
        policy: [authenticated, shareIncluded],
        validation: validJoiScheme({
            id: schemes.id
        }, 'body'),
        handler: async function(req, res, next){
            let userId = req.user._id
            if (req.user.isAdmin){
                try {
                    const share = await SharesCollection.findById(req.body.id)
                    if (!share){
                        throw new Error()
                    }
                    userId = share.originUser.id
                }
                catch(e){
                    req.session.logger(`invalid share id`)
                    return res.sendStatus(httpStatuses.NOT_FOUND)
                }
            }
            await SharesCollection.deleteShare(req.body.id, userId)
            req.session.logger(`share deleted`)
            return res.end()
        }
    }, {
        method: "put",
        policy: [authenticated, documentOwner],
        validation: [validJoiScheme({
            id: schemes.id,
            login: schemes.login
        }, 'body'), async function loginIsUser(req, res){
            try{
                let loginUser = await UsersCollection.find({login: req.body.login})
                if (loginUser.length === 0){
                    return httpStatuses.BAD_REQUEST
                }
                req.body.loginUser = loginUser[0]
            }
            catch(e){
                return res.sendStatus(httpStatuses.NOT_FOUND)
            }
        }],
        handler: async function(req, res, next){
            try{
                const loginUser = req.body.loginUser || (await UsersCollection.find({login: req.body.login}))[0]
                if (!loginUser || loginUser._id.toString() === req.user._id.toString()){
                    req.session.logger(`invalid partner user login`)
                    return res.sendStatus(httpStatuses.BAD_REQUEST)
                }
                const ownerPermission = await DocumentsCollection.getDocumentOwnerPermission(req.body.id)
                if (!ownerPermission){
                    throw new Error()
                }
                const owner = await UsersCollection.findById(ownerPermission.userId)
                let ownerId;
                if (!owner || owner._id.toString() !== req.user._id.toString()){
                    if (!req.user.isAdmin){
                        throw new Error()
                    }
                    ownerId = owner._id

                } else {
                    ownerId = req.user._id
                }
                try {
                    const share = await SharesCollection.createNew(
                        ownerId, loginUser._id, req.body.id
                    )
                    share.isOwner = true
                    req.session.logger(`share created (id: ${share._id})`)
                    return res.json({
                        id: share._id.toString(),
                        destinationUser: share.destinationUser,
                        originUser: share.originUser,
                        crypted: null,
                        prime: share.prime,
                        generator: share.generator,
                        documentId: share.documentId.toString(),
                        isOwner: true,
                        permissionId: share.permissionId ? share.permissionId.toString() : null,
                        state: share.state
                    })
                }
                catch (err){
                    req.session.logger(`invalid partner user login`)
                    return res.sendStatus(httpStatuses.BAD_REQUEST)
                }
            }
            catch(e){
                req.session.logger(`invalid share id`)
                return res.sendStatus(httpStatuses.NOT_FOUND)
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
            try{
                const share = req.body.share || await SharesCollection.findById(req.params.id)
                if (!share || share.state === -1){
                    throw new Error()
                }
                req.session.logger(`redirecting to state handler (state: ${share.state})`)
                return res.redirect(307, `/${path.basename(__filename).split('.')[0]}/${req.params.id}/${share.state}`)
            }
            catch(e){
                req.session.logger(`invalid share id`)
                return res.sendState(httpStatuses.NOT_FOUND)
            }
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
            try{
                const share = req.body.share || await SharesCollection.findById(req.params.id)
                if (!share || share.state !== 0){
                    throw new Error()
                }
                share.originUser.publicKey = req.body.publicKey
                share.state = 1
                await share.save()
            }
            catch(e){
                req.session.logger(`invalid share id`)
                return res.sendStatus(httpStatuses.NOT_FOUND)
            }
            req.session.logger(`share updated`)
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
            try{
                const share = req.body.share || await SharesCollection.findById(req.params.id)
                if (!share || share.state !== 1){
                    throw new Error()
                }
                share.destinationUser.publicKey = req.body.publicKey
                share.state = 2
                await share.save()
            }
            catch(e){
                req.session.logger(`invalid share id`)
                return res.sendStatus(httpStatuses.NOT_FOUND)
            }
            req.session.logger(`share updated`)
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
            try{
                const share = req.body.share || await SharesCollection.findById(req.params.id)
                if (!share || share.state !== 2){
                    throw new Error()
                }
                if (share.originUser.publicKey !== req.body.publicKey){
                    req.session.logger(`keys does not much`)
                    return res.sendStatus(httpStatuses.BAD_REQUEST)
                }
                share.crypted = req.body.crypted
                share.state = 3
                await share.save()
            }
            catch(e){
                req.session.logger(`invalid share id`)
                return res.sendStatus(httpStatuses.NOT_FOUND)
            }
            req.session.logger(`share updated`)
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
            try{
                const share = req.body.share || await SharesCollection.findById(req.params.id)
                if (!share || share.state !== 3){
                    throw new Error()
                }
                if (share.destinationUser.publicKey !== req.body.publicKey){
                    req.session.logger(`keys does not much`)
                    return res.sendStatus(httpStatuses.BAD_REQUEST)
                }
                if (!share.permissionId){
                    share.permissionId = await PermissionsCollection.createNew(
                        req.user._id, share.documentId, permissionTypes.reader, share._id
                    )
                    share.save()
                }
                req.session.logger(`share secret sent (id: ${share._id})`)
                res.json({
                    permissionId: share.permissionId,
                    crypted: share.crypted,
                    originUser: share.originUser,
                    destinationUser: share.destinationUser
                })
            }
            catch(e){
                req.session.logger(`invalid share id`)
                return res.sendStatus(httpStatuses.NOT_FOUND)
            }
        }
    }])
}

const mongoose = require('mongoose')
    , log = require('../helpers/log')
    , createModel = require('../helpers/createModel')
    , config = require('../config')
    , events = require('../middlewares/eventEmitter/events')
    , objectModels = {
        [config.PERMISSIONS_DATABASE_NAME]: require('./PermissionsCollection')
    }
    , timers = new mongoose.Schema({
        type: {
            type: String,
            required: true,
            enum: events.types
        },
        params: {
            type: Object,
            default: {}
        },
        when: { 
            type: Date,
            required: true
        },
        object: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        objectModelName: {
            type: String,
            required: true,
            enum: Object.keys(objectModels)
        },
    }, {
        minimize: false
    })

// populate bez typu Conversation.find().populate('creator', null, nazwakoleki).exec(callback);

timers.methods.invokeOnTime = function invokeOnTime(emitter) {
    let ms = this.when - new Date()
    ms = ms < 0 ? 0 : ms
    log.trace(`timer id: "${this._id}" is going to be executed in ${ms/1000.0} sec`)
    return new Promise((res, rej)=>{
        return setTimeout(async () => {
            log.debug(`timer id: "${this._id}" executing...`)
            if (!await deleteTimer(this._id)){
                const cancelMessage = `timer id "${this._id}" canceled`
                log.debug(cancelMessage)
                return rej(cancelMessage)
            }
            log.trace(`Emitting type: "${this.type}"`)
            return emitter.emit(this.type, {
                params: this.params,
                resolve: res,
                reject: rej
            })
        }, ms)
    })
}

const model = mongoose.model(config.TIMERS_DATABASE_NAME, timers)

model.deleteTimer = async function deleteTimer(id){
    try{
        const timer = await model.findById(id)
        if (!timer){
            throw new Error('')
        }
        if (!Object.keys(objectModels[timer.objectModelName]).length){
            objectModels[timer.objectModelName] = require(`./${timer.objectModelName}`)
        }
        await objectModels[timer.objectModelName].findByIdAndUpdate(timer.object, { $set: {timer: undefined}})
        await timer.delete()
        return timer
    }
    catch(e){
        return null
    }
}

model.timerAlreadyExistsError = new Error('Already has a timer or is invalid type')
model.createNew = async function createNew(type, params, ms, objectId, objectModelName){
    const timer = createModel(model, {
        type, params, objectModelName, 
        object: objectId, 
        when: new Date().getTime() + ms
    })
    try {
        if (!Object.keys(objectModels[timer.objectModelName]).length){
            objectModels[timer.objectModelName] = require(`./${timer.objectModelName}`)
        }
        const object = await objectModels[objectModelName].findById(objectId)
        if (object.timer){
            throw model.timerAlreadyExistsError
        }
        await objectModels[objectModelName].findByIdAndUpdate(objectId, {$set: {timer: timer._id}})
    }
    catch(err){
        model.findByIdAndDelete(timer._id)
        throw err
    }
    return timer
}

module.exports = model
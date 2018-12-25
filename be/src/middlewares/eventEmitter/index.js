const EventEmitter = require('events')
    , CallsCollection = require('../../models/TimersCollection')
    , events = require('./events')
    , log = require('../../helpers/log')

function emitHandler(util){
    return async options => {
        log.trace(`Executing ${util.name} with params:`, options.params)
        return util(options.params)
        .then(resolve)
        .catch(reject)
    }
}

module.exports = async app => {
    app.eventEmitter = new EventEmitter()

    for (const type of events.types){
        log.trace(`Event type: "${type}" regirested for function "${events.handlers[type].name}"`)
        app.eventEmitter.on(type, emitHandler(events.handlers[type]))
    }

    const retrieved = await CallsCollection.find({}) || []
    log.info(`${retrieved.length} calls has been restored`)
    retrieved.forEach(call =>
        call.invokeOnTime(app.eventEmitter)
        .then(output=>log.debug(`restored call id: "${call._id}" has finished execution output:`, output))
        .catch(err=>log.error(`restored call id: "${call._id}" has thown an error: ${err.name}: ${err.message}`))
    )
}
const EventEmitter = require('events')
    , TimersCollection = require('../../models/TimersCollection')
    , events = require('./events')
    , log = require('../../helpers/log')

function emitHandler(util){
    return async options => {
        log.trace(`Executing ${util.name} with params:`, options.params)
        return util(options.params)
        .catch(err=>log.warn("emit error: ", err))
    }
}

module.exports = async app => {
    app.eventEmitter = new EventEmitter()

    for (const type of events.types){
        log.trace(`Event type: "${type}" regirested for function "${events.handlers[type].name}"`)
        app.eventEmitter.on(type, emitHandler(events.handlers[type]))
    }

    const retrieved = await TimersCollection.find({}) || []
    log.info(`${retrieved.length} calls has been restored`)
    retrieved.forEach(timer =>
        timer.invokeOnTime(app.eventEmitter)
    )
}
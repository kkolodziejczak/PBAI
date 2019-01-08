const log = require('./log')

module.exports = async (model, props) => {
    const record = new model()
    Object.keys(props).forEach(key => {
        record[key] = props[key]
    })
    await record.save()
    log.trace(`A new record has been added to ${model.modelName} id: "${record._id}"`)
    return record
} 
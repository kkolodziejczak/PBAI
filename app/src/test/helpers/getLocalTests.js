const fs = require('fs')
    , path = require('path')

module.exports = (config, fileName, exceptions=[]) => {
    const dir = path.dirname(fileName)
    return fs.readdirSync(dir)
    .filter(file=>file !== path.basename(fileName))
    .filter(file=>!exceptions.includes(file))
    .map(file=>{
        const modulePath = path.parse(file).name
        return require(path.join(dir, modulePath))(config)
    })
}
const fs = require('fs')
    , path = require('path')

module.exports = (app, fileName) => {
    const dir = path.dirname(fileName)
    return fs.readdirSync(dir)
    .filter(file=>file !== path.basename(fileName))
    .map(file=>{
        const modulePath = path.parse(file).name
        return {
            path: `/${modulePath}` ,
            router: require(path.join(dir, modulePath))(app)
        }
    })
}
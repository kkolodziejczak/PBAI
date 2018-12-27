const getLocalTests = require('../helpers/getLocalTests')
    , path = require('path')

module.exports = function test(config){
    describe(path.parse(__filename).name, ()=>{
        getLocalTests(config, __filename)
    })
}
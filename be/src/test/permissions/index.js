const getLocalTests = require('../helpers/getLocalTests')
    , path = require('path')

module.exports = function test(config){
    describe(path.parse(__dirname).name, ()=>{
        getLocalTests(config, __filename)
    })
}
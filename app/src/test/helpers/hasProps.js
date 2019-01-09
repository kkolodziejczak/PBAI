const should = require('should')

module.exports = function hasProps(props){
    return res=>{
        for (const propKey in props){
            res.body.should.have.property(propKey, props[propKey])
        }
    }
}
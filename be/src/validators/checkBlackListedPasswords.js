const config = require('../config')
    , blackList = Object(require('../assets/password-black-list.json'))

module.exports = function checkBlackListedPasswords(req, res){
    if (config.REJECT_BLACKLISTED_PASSWORDS && blackList.hasOwnProperty(req.body.password)){
        return ["\"password\" is too simple"]
    }
}
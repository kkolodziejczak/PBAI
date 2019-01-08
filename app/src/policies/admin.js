module.exports = function isAdmin(req, res){
    if (req.isAuthenticated()){
        return req.user.isAdmin
    }
    return false
}
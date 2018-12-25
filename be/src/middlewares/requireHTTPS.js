const config = require('../config')

module.exports = function requireHTTPS(req, res, next){
  if (config.HTTPS && !req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect(`https://${req.get('host')}${req.url}`)
  }
  next()
}
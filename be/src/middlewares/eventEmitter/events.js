const PermissionsCollection = require('../../models/PermissionsCollection')

const handlers = Object.freeze({
    deletePermission: function deletePermission(params){
        PermissionsCollection.deletePermission(params.id)
    }
})

module.exports = {
   handlers,
   types: Object.keys(handlers)
}
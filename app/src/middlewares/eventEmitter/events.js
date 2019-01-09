const PermissionsCollection = require('../../models/PermissionsCollection')

const handlers = Object.freeze({
    deletePermission: async function deletePermission(params){
        return await PermissionsCollection.deletePermission(params.id, params.userId)
    }
})

module.exports = {
   handlers,
   types: Object.keys(handlers)
}
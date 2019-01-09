module.exports = function test(config){
    describe("logs - get", ()=>{
        it('admin can get logs', async()=>{
            await config.users[0].agent
            .get('/logs')
            .expect(200)
        })
        it('regular user can not get logs', async()=>{
            await config.users[1].agent
            .get('/logs')
            .expect(404)
        })
    })
}
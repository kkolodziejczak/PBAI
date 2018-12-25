const chai = require('chai')
    , cheerio = require("cheerio")
    , agent = require('supertest').agent

async function checkHTMLTitle(agent, url, expected){
    return new Promise(resolve=>
        agent
        .get(url)
        .expect(200)
        .expect('content-type', 'text/html; charset=utf-8')
        .end((err, res)=>{
            if (err) throw err
            const $ = cheerio.load(res.text)
            let title = $('title').text()
            resolve(chai.expect(title.toLowerCase()).to.equal(expected.toLowerCase()))
        })
    )
}

const redirect = {
    post: async function redirectPost(agent, url, body, redirect){
        return new Promise(resolve=>
            agent
            .post(url)
            .send(body)
            .expect(302)
            .end((err, res)=>{
                if (err) throw err
                resolve(chai.expect(res.text.toLowerCase())
                .to.equal(`Found. Redirecting to ${redirect}`.toLowerCase()))
            })
        )
    },
    get: async function redirectGet(agent, url, redirect){
        return new Promise(resolve=>
            agent
            .get(url)
            .expect(302)
            .end((err, res)=>{
                if (err) throw err
                resolve(chai.expect(res.text.toLowerCase())
                .to.equal(`Found. Redirecting to ${redirect}`.toLowerCase()))
            })
        )
    }
}

async function signIn(agent, username, password){
    return new Promise(resolve=>
        agent
        .post('/sign/in')
        .send({username, password})
        .expect(302)
        .end((err, res)=>{
            if (err) throw err
            chai.expect(res.text.toLowerCase())
            .to.equal(`Found. Redirecting to /`.toLowerCase())
            // agent.jar.setCookie(res.headers['set-cookie'][0])
            return resolve(agent)
        })
    )
}

module.exports = {
    checkHTMLTitle,
    redirect,
    signIn
}
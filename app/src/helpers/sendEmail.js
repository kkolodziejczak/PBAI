const nodemailer = require('nodemailer')
    , config = require('../config')

const transporter = nodemailer.createTransport({
    service: config.EMAIL_SERVICE,
    auth: {
        user: config.EMAIL_LOGIN,
        pass: config.EMAIL_PASSWORD
    }
})

function htmlFactory(header, content){
    return `
<div style="background-color: black">
<h1 style="color: red">${header}</h1>
${content}
</div>
`
}

module.exports = function sendEmail(subject, content) {
    return new Promise((res, rej)=>{
        if (config.EMAILS === false){
            return res()
        }
        return transporter.sendMail({
            from: `"DOCUMENT MANAGMENT APP" <${config.EMAIL_LOGIN}>`,
            to: config.EMAIL_LOGIN,
            subject,
            html: htmlFactory(subject, content),
        }, (err, info)=>{
            if (err){
                err.stack = `Email not send:\nsubject: ${subject}\ntext: ${text}\n${err.stack}`
                return rej(err)
            }
            return res(info)
        })
    })
}
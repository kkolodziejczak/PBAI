const log = require('./src/helpers/log')
    , app = require('./src/app')

app()
.then(exp=>
    log.info(`Server is listening on port ${exp.server.address().port}`)
)
.catch(e=>
    process.env.NODE_ENV !== 'production'
    ? log.error(`${e.stack}`)
    : log.error(`${e.name}: ${e.message}`)
)
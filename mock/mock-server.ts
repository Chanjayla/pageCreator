import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import morgan from 'morgan'
import cors from 'cors'
import http from 'http'
import path from 'path'
import yaml from 'yamljs'

const app = express()
const port = 8888

app.use(compression())
app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.json({ limit: '20mb' }))
app.use(
    bodyParser.urlencoded({
        limit: '20mb',
        extended: false,
    })
)
app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.header('Pragma', 'no-cache')
    res.header('Expires', '-1')
    next()
})
app.use((req, res, next) => {
    const err = new Error('Not Found')
    res.status(404).json({
        message: err.message,
        error: err,
    })
})

const server = http.createServer(app)
server.listen(port)
server.on('error', (error: any) => {
    if (error.syscall !== 'listen') {
        throw error
    }
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port
    switch (error.code) {
        case 'EACCES':
            console.error(
                'Express ERROR (app) : %s requires elevated privileges',
                bind
            )
            process.exit(1)
        case 'EADDRINUSE':
            console.error('Express ERROR (app) : %s is already in use', bind)
            process.exit(1)
        default:
            throw error
    }
})

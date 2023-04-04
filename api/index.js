import bodyParser from 'body-parser'
import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import v1Routes from './v1Routes.js'
import v2Routes from './v2Routes.js'
import path from 'path'

dotenv.config()

const app = express()
const port = 8080
app.use(bodyParser.json())
app.use(cors({
  origin: '*'
}))

app.get('/', function (req, res) {
  const __dirname = path.resolve()
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

// Middleware to check the version of the API
const checkVersion = (req, res, next) => {
  // If the request has explicitly specified a version param, use that
  if (
    req.url.startsWith('/v1') ||
    req.url.startsWith('/v2')
  ) {
    next()
    return
  }
  const version = req.headers['api-version'] || 1
  req.version = version
  if (version === '2') {
    req.url = `/v2${req.url}`
  } else {
    req.url = `/v1${req.url}`
  }
  next()
}

// Use the middleware on all requests
app.use(checkVersion)

app.use('/v1', v1Routes)

app.use('/v2', v2Routes)

// Use the appropriate version of the routes based on the version detected in the middleware
// Handle requests that didn't match any version
app.use((req, res) => {
  res.status(404).send('Route not found')
})
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

// const app = require('./app')
import app from './app'
// const http = require('http')
// const config = require('./utils/config')
// const logger = require('./utils/logger')

// const server = http.createServer(app)

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

// app.listen(config.PORT, () => {
//   logger.info(`Server running on port ${config.PORT}`)
// })
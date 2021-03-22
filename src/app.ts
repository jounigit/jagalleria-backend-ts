import express from 'express'
import 'express-async-errors'
const app = express()
import cors from 'cors'
import loginRouter from './routes/login'
import userRouter from './routes/users'
import albumRouter from './routes/albums'
import categoryRouter from './routes/categories'
import pictureRouter from './routes/pictures'
import middleware from './utils/middleware'
import logger from './utils/logger'
import mongoose from 'mongoose'
import 'dotenv/config'

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

logger.info('connecting to', `${process.env.MONGODB_URI}`)

mongoose.connect(`${process.env.MONGODB_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false
  })
  .then(() => {
    logger.info('connected to MongoDB')
  })

  app.use(cors())
  app.use(express.json())
  app.use(middleware.requestLogger)

app.get('/api/ping', (_req, res) => { 
    console.log('someone pinged here');
    res.json('pong');
})


app.use('/api/login', loginRouter)
app.use('/api/users', userRouter)
app.use('/api/albums', albumRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/pictures', pictureRouter)

if (process.env.NODE_ENV === 'test') {
  console.log('TESTING ENV app')
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
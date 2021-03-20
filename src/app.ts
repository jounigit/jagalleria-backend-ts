import express from 'express'

const app = express()
import cors from 'cors'
import categoryRouter from './routes/categories'
import logger from './utils/logger'
import mongoose from 'mongoose'
// import { config } from 'dotenv/types'
// import config from './utils/config'
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

app.use(express.json());
app.use(cors())

app.get('/api/ping', (_req, res) => { 
    console.log('someone pinged here');
    res.send('pong');
  })

app.use('/api/categories', categoryRouter)

export default app
import express from 'express'

const app = express()
import cors from 'cors'

app.use(express.json());
app.use(cors())

app.get('/api/ping', (_req, res) => { 
    console.log('someone pinged here');
    res.send('pong');
  })

export default app
import * as dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB

const JWTSecret = process.env.JWT_SECRET

if (process.env.NODE_ENV === 'test') {
  console.log('TESTING ENV config: ', process.env.MONGODB_TEST)
  MONGODB_URI = process.env.MONGODB_TEST
}

export default {
  PORT,
  MONGODB_URI,
  JWTSecret
}
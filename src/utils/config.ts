import * as dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT
let MONGODB_URI

if (process.env.NODE_ENV === 'test') {
    console.log('TESTING ENV config', process.env.TEST_MONGODB_URI)
    MONGODB_URI = process.env.TEST_MONGODB_URI
}

MONGODB_URI = process.env.MONGODB_URI

export default {
    PORT,
    MONGODB_URI
}

// export default {
//     UserBaseUrl: process.env.USER_SERVICE_URL ?? '',
//     EtlUrl: process.env.ETL_SERVICE_URL ?? ''
//    }
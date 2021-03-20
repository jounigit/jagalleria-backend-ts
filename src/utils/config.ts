import * as dotenv from 'dotenv'

dotenv.config()

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

export default {
    PORT,
    MONGODB_URI
}

// export default {
//     UserBaseUrl: process.env.USER_SERVICE_URL ?? '',
//     EtlUrl: process.env.ETL_SERVICE_URL ?? ''
//    }
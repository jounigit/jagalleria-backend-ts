import * as dotenv from 'dotenv'

dotenv.config()

let PORT = process.env.PORT

export default {
    PORT
}

// export default {
//     UserBaseUrl: process.env.USER_SERVICE_URL ?? '',
//     EtlUrl: process.env.ETL_SERVICE_URL ?? ''
//    }
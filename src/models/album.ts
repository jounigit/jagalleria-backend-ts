import mongoose from 'mongoose'
import { Album } from '../types'

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
      },
      slug: {
        type: String,
        slug: 'title',
        slugPaddingSize: 4,
        unique: true
      },
      content: String 
})

const albumModel = mongoose.model<Album & mongoose.Document>('Album', albumSchema)

export default albumModel
import mongoose, { Schema, Document } from 'mongoose'
import { Album } from '../types'

export interface AlbumDocument extends Album, Document {
  id: string
}

const albumSchema: Schema = new Schema({
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
      content: String,
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
      },
      pictures: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Picture'
        }
      ]
})

albumSchema.set('toJSON', {
  transform: (_doc: Document, returnedObject: AlbumDocument) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Album = mongoose.model<AlbumDocument>('Album', albumSchema)

export default Album
import mongoose, { Document } from 'mongoose'
import { IPicture } from '../types'

// type PictureDocument = Picture & mongoose.Document
export interface PictureDocument extends IPicture, Document {
  id: string
}

const pictureSchema = new mongoose.Schema({
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
    content: {
      type: String
    },
    image: {
      type: String
    },
    thumb: {
      type: String
    },
    landscape: {
      type: String
    },
    publicID:{
      type: String
    },
    publicIDThumb:{
      type: String
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  })

  pictureSchema.set('toJSON', {
    transform: (_doc: Document, returnedObject: PictureDocument) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  pictureSchema.pre('remove', function (next) {
    this.model('User').updateOne(
      { pictures: this._id },
      { $pull: { pictures: this._id } },
      { multi: true },
      next )
  })

  pictureSchema.pre('remove', function (next) {
    this.model('Album').updateMany(
      { pictures: this._id },
      { $pull: { pictures: this._id } },
      { multi: true },
      next)
  })

const Picture = mongoose.model<PictureDocument>('Picture', pictureSchema)

export default Picture
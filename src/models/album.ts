import mongoose, { Schema, Document } from 'mongoose'
import { IAlbum } from '../types'

export interface AlbumDocument extends IAlbum, Document {
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
  transform: (_doc: Document, ret: AlbumDocument) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  }
})

albumSchema.pre('remove', function (next) {
  const album = this
  album.model('User').updateOne(
    { albums: album._id },
    { $pull: { albums: album._id } },
    { multi: true },
    next )
})

albumSchema.pre('remove', function (next) {
  this.model('Category').updateOne(
    { albums: this._id },
    { $pull: { albums: this._id } },
    { multi: true },
    next)
})

const Album = mongoose.model<AlbumDocument>('Album', albumSchema)

export default Album
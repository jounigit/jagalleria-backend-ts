import mongoose from 'mongoose'
import { Picture } from '../types'

type PictureDocument = Picture & mongoose.Document

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

const Picture = mongoose.model<PictureDocument>('Picture', pictureSchema)

export default Picture
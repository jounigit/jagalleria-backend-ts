import mongoose from 'mongoose'
import { Category } from '../types'
// import slug from 'mongoose-slug-updater'
// import beautifyUnique from 'mongoose-beautiful-unique-validation'

const categorySchema = new mongoose.Schema({
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
    albums: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album'
      }
    ],
  })

// categorySchema.plugin(beautifyUnique)
// categorySchema.plugin(slug)

const categoryModel = mongoose.model<Category & mongoose.Document>('Category', categorySchema)

export default categoryModel


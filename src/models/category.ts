import mongoose, { Document } from 'mongoose'
import { Category } from '../types'
// import slug from 'mongoose-slug-updater'
// import beautifyUnique from 'mongoose-beautiful-unique-validation'

// export type CategoryDocument = Category & Document

export interface CategoryDocument extends Category, Document {
  id: string
}

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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    albums: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album'
      }
    ]
  })

  categorySchema.set('toJSON', {
    transform: (_doc: Document, returnedObject: CategoryDocument) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

// categorySchema.plugin(beautifyUnique)
// categorySchema.plugin(slug)

const Category = mongoose.model<CategoryDocument>('Category', categorySchema)

export default Category


import mongoose from 'mongoose'
import { User } from '../types'

type UserDocument = User & mongoose.Document

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      unique: true
    },
    email: {
      type: String, required: true,
      unique: true
    },
    passwordHash: String,
    role: {
      type: String,
      enum : ['editor', 'admin'],
      default: 'editor'
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      }
    ],
    albums: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album'
      }
    ],
    pictures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Picture'
      }
    ],
  })

  const User = mongoose.model<UserDocument>('User', userSchema)

export default User
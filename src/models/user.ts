import mongoose from 'mongoose'
import { IUser } from '../types'

// type UserDocument = User & mongoose.Document
export interface UserDocument extends IUser, mongoose.Document {
  id: string;
  passwordHash: string;
}

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

  userSchema.set('toJSON', {
    transform: (_doc: Document, returnedObject: UserDocument) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  userSchema.pre('remove', function (next) {
    const user = this
    user.model('Album').deleteMany(
      { user: user._id },
      { multi: true },
      next)
  })

  userSchema.pre('remove', function (next) {
    console.log('UserSchema middleware:')
    const user = this
    user.model('Category').deleteMany(
      { user: user._id },
      { multi: true },
      next)
  })

  userSchema.pre('remove', function (next) {
    const user = this
    user.model('Picture').deleteMany(
      { user: user._id },
      { multi: true },
      next)
  })

  const User = mongoose.model<UserDocument>('User', userSchema)

export default User
/* eslint-disable no-undef */
// test-setup.js
import mongoose from 'mongoose'
mongoose.set('useCreateIndex', true)
mongoose.Promise = global.Promise

export async function removeAllCollections () {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    await collection.deleteMany({})
  }
}

export async function dropAllCollections () {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    try {
      await collection.drop()
    } catch (error) {
      // Sometimes this error happens, but you can safely ignore it
      if (error.message === 'ns not found') return
      // This error occurs when you use it.todo. You can
      // safely ignore this error too
      if (error.message.includes('a background operation is currently running'))
      console.log(error.message)
      return
    }
  }
}

export async function closeDB() {
  await mongoose.connection.close()
}

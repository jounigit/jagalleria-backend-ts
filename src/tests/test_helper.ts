import supertest from 'supertest'
import app from '../app'
import { NewCategory } from '../types'
const api = supertest(app)

//********** constants *******************************/
const initialCategories: NewCategory[] = [
  {
    title: 'Category 1',
    content: 'HTML is easy',
    user: '1'
  },
  {
    title: 'Category 2',
    content: 'Täällä tätä.',
    user: '1'
  }
]

const initialAlbums = [
  {
    title: 'Album 1',
    content: 'Täällä 1',
  },
  {
    title: 'Album 2',
    content: 'Täällä 2.',
  },
  {
    title: 'Album 3',
    content: 'Täällä 3',
  },
]

const initialPictures = [
  {
    title: 'Picture 1',
    image: 'image.jpg'
  },
  {
    title: 'Picture 2',
    image: 'image.jpg'
  },
  {
    title: 'Picture 3',
    image: 'image.jpg'
  },
]

//********** common helpers *******************************/
const createDoc = async(path: string, title: string) => {
  return await api
    .post(`/api/${path}`)
    .send({ title })
    // .set('Authorization', `Bearer ${token}`)
    .expect(200)
}

export default {
  // username,
  // email,
  // password,
  initialCategories,
  initialAlbums,
  initialPictures,
  createDoc,
  // nonExistingId,
  // addTestUser,
  // getToken,
  // allInCollection
}
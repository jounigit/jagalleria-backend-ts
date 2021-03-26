import supertest from 'supertest'
import app from '../app'
// import { NewCategory } from '../types'
const api = supertest(app)
import bcrypt from 'bcrypt'
import User from '../models/user'

//********** constants *******************************/

const initialPictures = [
  {
    "title": "Kuva 1",
    "slug": "kuva-1",
    "image": "https://source.unsplash.com/random",
    "thumb": "https://source.unsplash.com/random",
    "landscape": "https://source.unsplash.com/random",
    "publicID": "1",
    "publicIDThumb": "1",
    "user": "5ee7466af1c4e01d303f9dc5"
  },
  {
    "title": "Kuva 2",
    "slug": "kuva-2",
    "image": "https://source.unsplash.com/random",
    "thumb": "https://source.unsplash.com/random",
    "landscape": "https://source.unsplash.com/random",
    "publicID": "2",
    "publicIDThumb": "2",
    "user": "5ee7466af1c4e01d303f9dc5"
  }
]

//********** user helpers *******************************/
const username = 'test'
const email = 'test@mail.com'
const password = 'testpassi'
const role = 'editor'

const addTestUser = async (user=username, mail=email, pass=password, r=role) => {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(pass, saltRounds)

  const testUser = {
    username: user,
    email: mail,
    passwordHash,
    role: r
  }

  const newUser = await User.create(testUser)
  console.log('Testhelper New user: ', newUser.id)
  return newUser
}

const getToken = async (user=username, pass=password) => {
  const response = await api
    .post('/api/login')
    .send({
      username:user,
      password:pass,
    })

  // console.log('GET VALID TOKEN: ', response.body.token)
  return response.body.token
}


//********** common helpers *******************************/
const createDoc = async(path: string, title: string, token: string) => {
  const res = await api
    .post(`/api/${path}`)
    .send({ title })
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    console.log('Create doc: ', res.body)
    return res.body
}

const createPicture = async(title: string, token: string) => {
  const newPic = {
    "title": title,
    "image": "https://source.unsplash.com/random",
    "thumb": "https://source.unsplash.com/random",
    "landscape": "https://source.unsplash.com/random",
    "publicID": "2",
    "publicIDThumb": "2"
  }

  const res = await api
    .post(`/api/pictures`)
    .send(newPic)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
  return res.body
}

export default {
  username,
  email,
  password,
  // initialCategories,
  // initialAlbums,
  initialPictures,
  createDoc,
  createPicture,
  addTestUser,
  getToken,
  // allInCollection
}
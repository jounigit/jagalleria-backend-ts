import supertest from 'supertest'
import helper from './test_helper'
import app from '../app'
const api = supertest(app)
import {
  removeAllCollections,
  dropAllCollections,
  closeDB
} from './test-setup'
import { IAlbum,
  // ICategory
} from '../types'

// import Album from '../models/album'
let token: string
let album1: IAlbum
let album2: IAlbum
// let category1: ICategory

beforeEach( async () => {
  await helper.addTestUser()
  token = await helper.getToken()
  album1 = await helper.createDoc('albums', 'album 1', token)
  album2 = await helper.createDoc('albums', 'album 2', token)
})

afterEach(async () => {
  await removeAllCollections()
})

afterAll(async () => {
  await dropAllCollections()
  await closeDB()
})

//****************** succeeds ************************************/
describe('Test with initial albums', () => {
    test('succeeds return albums as json', async () => {
      console.log('Cats 1: ', album1)
      console.log('Cats 2: ', album2)

      const res = await api
      .get('/api/albums')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      expect(res.body.length).toBe(2)
    })

      // get one
    test('succeeds view a specific album', async () => {
      const result = await api
        .get(`/api/albums/${album1.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(result.body).toEqual(album1)
    })
  })

//****************** fails ************************************/
// status code 404

// status code 400
describe('if id is invalid', () => {
  test('fails with statuscode 400', async () => {

    await api
      .get(`/api/albums/000`)
      .expect(400)
  })
})
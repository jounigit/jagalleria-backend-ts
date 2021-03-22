import supertest from 'supertest'
import helper from './test_helper'
import app from '../app'
const api = supertest(app)
import {
  removeAllCollections,
  dropAllCollections,
  closeDB
} from './test-setup'
import { Album } from '../types'

// import Album from '../models/album'
let album1: Album
let album2: Album

beforeEach( async () => {
  const getCat1 = await helper.createDoc('albums', 'album 1')
  const getCat2 = await helper.createDoc('albums', 'album 2')
  album1 = getCat1.body
  album2 = getCat2.body
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

      await api
      .get('/api/albums')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    })

    test('all albums are returned', async () => {
      const response = await api.get('/api/albums')
  
      expect(response.body.length).toBe(2)
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
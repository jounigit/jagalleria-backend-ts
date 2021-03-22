import supertest from 'supertest'
import helper from './test_helper'
import app from '../app'
const api = supertest(app)
import {
  removeAllCollections,
  dropAllCollections,
  closeDB
} from './test-setup'
import { Category } from '../types'

// import Category from '../models/category'
let category1: Category
let category2: Category

beforeEach( async () => {
  const getCat1 = await helper.createDoc('categories', 'category 1')
  const getCat2 = await helper.createDoc('categories', 'category 2')
  category1 = getCat1.body
  category2 = getCat2.body
})

afterEach(async () => {
  await removeAllCollections()
})

afterAll(async () => {
  await dropAllCollections()
  await closeDB()
})

//****************** succeeds ************************************/
describe('Test with initial categories', () => {
    test('succeeds return categories as json', async () => {
      console.log('Cats 1: ', category1)
      console.log('Cats 2: ', category2)

      await api
      .get('/api/categories')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    })

    test('all categories are returned', async () => {
      const response = await api.get('/api/categories')
  
      expect(response.body.length).toBe(2)
    })

      // get one
    test('succeeds view a specific category', async () => {
      const result = await api
        .get(`/api/categories/${category1.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(result.body).toEqual(category1)
    })
  })

//****************** fails ************************************/
// status code 404
describe('if category does not exist', () => {
  // test('fails with statuscode 404', async () => {
  //   const invalidId = '5a3d5da59070081a82a3445'

  //   await api
  //     .get(`/api/categories/${invalidId}`)
  //     .expect(404)
  // })
})
// status code 400
describe('if id is invalid', () => {
  test('fails with statuscode 400', async () => {

    await api
      .get(`/api/categories/000`)
      .expect(400)
  })
})
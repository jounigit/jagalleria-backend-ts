import supertest from 'supertest'
import helper from './test_helper'
import app from '../app'
const api = supertest(app)

import { ICategory } from '../types'
import { doAfterAll, doAfterEach } from './test-setup'

doAfterEach()
doAfterAll()

let token: string
let category1: ICategory
let category2: ICategory

beforeEach( async () => {
  await helper.addTestUser()
  token = await helper.getToken()
  category1 = await helper.createDoc('categories', 'category 1', token)
  category2 = await helper.createDoc('categories', 'category 2', token)
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
// status code 400
describe('if id is invalid', () => {
  test('fails with statuscode 400', async () => {

    await api
      .get(`/api/categories/000`)
      .expect(400)
  })
})
/* eslint-disable no-undef */
import supertest from 'supertest'
import helper from './test_helper'
import app from '../app'
const api = supertest(app)
import {
  doAfterEach,
  doAfterAll
} from './test-setup'
import { Category } from '../types'

doAfterEach()
doAfterAll()

let token: string
let category1: Category
// let album2: Album


beforeEach( async () => {
  await helper.addTestUser()
  token = await helper.getToken()
})

//***************** succeeds ******************************/
describe('authorized with a valid token adding new category', () => {
  // create
  test.only('succeeds', async () => {
    await api
      .post('/api/categories')
      .send({ title: 'Category added' })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })
})

describe('authorized with a valid token and permission', () => {
  beforeEach( async () => {
    const getDoc1 = await helper.createDoc('categories', 'Category 1', token)
    category1 = getDoc1.body
    console.log('Category update ', category1)
  })

  //** update */
  test.only('succeeds update with valid id and permission',  async  () => {
    const title = 'Updated'

    const response = await api
      .put(`/api/categories/${category1.id}`)
      .send({ title })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(title).toContain(response.body.title)
  })

  //** delete */
  test.only('succeeds delete with valid id', async () => {
    const categoriesAtStart = await api.get('/api/categories')
  
    await api
      .delete(`/api/categories/${category1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const categoriesAtEnd = await api.get('/api/categories')
    expect(categoriesAtEnd.body.length).toBe(categoriesAtStart.body.length-1)
  })
})


//***************** fails ******************************/
describe('authorized with a valid token with no permission', () => {
  // let wrongToken
  beforeEach( async () => {
    await api
      .post('/api/categories')
      .send({ title: 'Category to update' })
      // .set('Authorization', `Bearer ${token}`)

    // await helper.addTestUser('eilupaa', 'e@mail.com', 'vikapassi', 'editor')
    // wrongToken = await helper.getToken('eilupaa', 'vikapassi')
  })

  test('fails update',  async  () => {
    const categories = await api.get('/api/categories')
    const category = categories.body[0]

    const response = await api
      .put(`/api/categories/${category.id}`)
      .send({ title: 'Updated' })
      // .set('Authorization', `Bearer ${wrongToken}`)
      .expect(403)
      .expect('Content-Type', /application\/json/)

    const { error } = response.body
    expect(error).toContain('You don\'t have enough permission')
  })

  // delete
  test('fails delete ', async () => {
    const categories = await api.get('/api/categories')
    const categoryToDelete = categories.body[0]
    const response = await api
      .delete(`/api/categories/${categoryToDelete.id}`)
      // .set('Authorization', `Bearer ${wrongToken}`)
      .expect(403)

    const { error } = response.body
    expect(error).toContain('You don\'t have enough permission')
  })
})


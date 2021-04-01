/* eslint-disable no-undef */
import supertest from 'supertest'
import helper from './test_helper'
import app from '../app'
const api = supertest(app)
import {
  doAfterEach,
  doAfterAll
} from './test-setup'
import { ICategory } from '../types'

doAfterEach()
doAfterAll()

let token: string
let category1: ICategory
// let album2: Album


beforeEach( async () => {
  await helper.addTestUser()
  token = await helper.getToken()
  category1 = await helper.createDoc('categories', 'category 1', token)
})

//***************** succeeds ******************************/
describe('authorized with a valid token adding new category', () => {
  // create
  test('succeeds', async () => {
    await api
      .post('/api/categories')
      .send({ title: 'Category added' })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })
})

describe('authorized with a valid token and permission', () => {
  //** update */
  test('succeeds update with valid id and permission',  async  () => {
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
  test('succeeds delete with valid id', async () => {
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
describe('authorized with no access permission', () => {
  let wrongToken: string
  beforeEach( async () => {
    await helper.addTestUser('eilupaa', 'e@mail.com', 'vikapassi', 'editor')
    wrongToken = await helper.getToken('eilupaa', 'vikapassi')
  })

  test('fails update',  async  () => {
    await api
      .put(`/api/categories/${category1.id}`)
      .send({ title: 'Updated' })
      .set('Authorization', `Bearer ${wrongToken}`)
      .expect(403)
  })

  // delete
  test('fails delete ', async () => {
    await api
      .delete(`/api/categories/${category1.id}`)
      .set('Authorization', `Bearer ${wrongToken}`)
      .expect(403)
  })
})

//***************** succeeds with all permissions ******************************/
describe('super admin with all permission', () => {
  let superToken: string
  beforeEach( async () => {
    await helper.addTestUser('super', 's@mail.com', 'superpassi', 'admin')
    superToken = await helper.getToken('super', 'superpassi')
  })

  test('succeeds update',  async  () => {
    await api
      .put(`/api/categories/${category1.id}`)
      .send({ title: 'Updated' })
      .set('Authorization', `Bearer ${superToken}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  // delete
  test('fails delete ', async () => {
    await api
      .delete(`/api/categories/${category1.id}`)
      .set('Authorization', `Bearer ${superToken}`)
      .expect(204)
  })
})

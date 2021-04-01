/* eslint-disable no-undef */
import supertest from 'supertest'
import helper from './test_helper'
import app from '../app'
const api = supertest(app)
import {
  doAfterEach,
  doAfterAll
} from './test-setup'
import { IAlbum } from '../types'

doAfterEach()
doAfterAll()

let token: string
let album1: IAlbum
// let album2: Album

beforeEach( async () => {
  await helper.addTestUser()
  token = await helper.getToken()
  album1 = await helper.createDoc('albums', 'album 1', token)
})
//***************** admin succeeds ******************************/
describe('authorized with a valid token adding new album', () => {
  // create
  test('succeeds adding new album', async () => {
    await api
      .post('/api/albums')
      .send({ title: 'Album added' })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })
})

describe('authorized with a valid token and permission', () => {
  //** update*/
  test('succeeds update with valid id and permission',  async  () => {
    const title = 'Updated'

    const response = await api
      .put(`/api/albums/${album1.id}`)
      .send({ title })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(title).toContain(response.body.title)
  })

  //**delete */
  test('succeeds delete with valid id', async () => {
    const atStart = await api.get('/api/albums')

    await api
      .delete(`/api/albums/${album1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const atEnd = await api.get('/api/albums')
    expect(atEnd.body.length).toBe(atStart.body.length-1)
  })
})

//***************** fails accesscontroll ***************************/
describe('authorized with a valid token with no permission', () => {
  let wrongToken: string

  beforeEach( async () => {
    await helper.addTestUser('eilupaa', 'e@mail.com', 'vikapassi', 'editor')
    wrongToken = await helper.getToken('eilupaa', 'vikapassi')
  })

  test('fails update',  async  () => {
    await api
      .put(`/api/albums/${album1.id}`)
      .send({ title: 'Updated' })
      .set('Authorization', `Bearer ${wrongToken}`)
      .expect(403)

  })

  // delete
  test('fails delete ', async () => {
    await api
      .delete(`/api/albums/${album1.id}`)
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
      .put(`/api/albums/${album1.id}`)
      .send({ title: 'Updated' })
      .set('Authorization', `Bearer ${superToken}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  // delete
  test('fails delete ', async () => {
    await api
      .delete(`/api/albums/${album1.id}`)
      .set('Authorization', `Bearer ${superToken}`)
      .expect(204)
  })
})

/* eslint-disable no-undef */
import supertest from 'supertest'
import helper from './test_helper'
import app from '../app'
const api = supertest(app)
import {
  doAfterEach,
  doAfterAll
} from './test-setup'
import { Album } from '../types'

doAfterEach()
doAfterAll()

let token: string
let album1: Album
// let album2: Album

beforeEach( async () => {
  await helper.addTestUser()
  token = await helper.getToken()
  // console.log('Before Test token: ', token)
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
  beforeEach( async () => {
    const getDoc1 = await helper.createDoc('albums', 'Album 1', token)
    album1 = getDoc1.body
    console.log('#####Update before album1: ', album1)
  })

  //** update*/ 
  test('succeeds update with valid id and permission',  async  () => {
    const title = 'Updated'
    console.log('###### Update album1: ', album1)

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
// describe('authorized with a valid token with no permission', () => {
//   let wrongToken: string

//   beforeEach( async () => {
//     const albums = await api
//       .post('/api/albums')
//       .send({ title: 'Album to update' })
//       .set('Authorization', `Bearer ${token}`)
//     console.log('Albums Update: ', albums)

//     await helper.addTestUser('eilupaa', 'e@mail.com', 'vikapassi', 'editor')
//     wrongToken = await helper.getToken('eilupaa', 'vikapassi')
//   })

//   test.only('fails update',  async  () => {
//     const albums = await api.get('/api/albums')
//     const album = albums.body[0]

//     await api
//       .put(`/api/albums/${album.id}`)
//       .send({ title: 'Updated' })
//       .set('Authorization', `Bearer ${wrongToken}`)
//       .expect(403)
//       .expect('Content-Type', /application\/json/)

//   })

//   // delete
//   test('fails delete ', async () => {
//     const albums = await api.get('/api/albums')
//     const albumToDelete = albums.body[0]
//     await api
//       .delete(`/api/albums/${albumToDelete.id}`)
//       .set('Authorization', `Bearer ${wrongToken}`)
//       .expect(403)

//   })
// })

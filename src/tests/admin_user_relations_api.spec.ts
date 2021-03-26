/* eslint-disable no-undef */
import supertest from 'supertest'
import helper from './test_helper'
import app from '../app'
const api = supertest(app)
import {
  doAfterEach,
  doAfterAll
} from './test-setup'
import {
  ICategory,
  IAlbum,
  IPicture,
  IUser } from '../types'

doAfterEach()
doAfterAll()

let testUser: IUser
let testUser2: IUser
let token: string
let token2: string
let category1: ICategory
let category2: ICategory
let album1: IAlbum
let album2: IAlbum
let picture1: IPicture
let picture2: IPicture

const deleteDoc = async(path: string, id: string, token: string) => {
  return await api
    .delete(`/api/${path}/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)
}

const nonExistingDoc = async(path: string, id: string) => {
  console.log('#Non exist doc: ', id)
  return await api
    .get(`/api/${path}/${id}`)
    .expect(404)
}

beforeEach( async () => {
  testUser = await helper.addTestUser()
  token = await helper.getToken()
  album1 = await helper.createDoc('albums', 'album 1', token)
  category1 = await helper.createDoc('categories', 'category 1', token)
  picture1 = await helper.createPicture('Kuva 123', token)
})

//***************** user relation ***********************************/
describe('user relations', () => {
  let userNow: IUser
  beforeEach(async () => {
    const u1 = await api.get(`/api/users/${testUser.id}`)
    userNow = u1.body
  })
  test('should have category relation', async () => {
    expect(category1.user).toBe(testUser.id)
  })

  test('should have album relation', async () => {
    expect(album1.user).toBe(testUser.id)
  })

  test('should have picture relation', async () => {
    expect(picture1.user).toBe(testUser.id)
  })

  test('should have album in user', async () => {
    console.log('## User now:', userNow)
    expect(userNow.albums).toContain(album1.id)
  })

  test('should have category in user', async () => {
    expect(userNow.categories).toContain(category1.id)
  })

  test('should have picture in user', async () => {
    expect(userNow.pictures).toContain(picture1.id)
  })
})

//***************** user delete relation ******************************/

describe('user deleting', () => {
  beforeEach( async () => {
    album2 = await helper.createDoc('albums', 'album 2', token)
    await deleteDoc('users', testUser.id, token)
  })

  test('should delete albums with relation', async () => {
    // console.log('## TEST DELETE album: ', album1)
    nonExistingDoc('albums', album1.id)
    nonExistingDoc('albums', album2.id)
  })

  test('should delete category with relation', async () => {
    nonExistingDoc('categories', category1.id)
    // console.log('Current: ', current.error)
  })

  test('should delete picture with relation', async () => {
    nonExistingDoc('pictures', picture1.id)
    // console.log('Current: ', current)
  })

})

describe('deleting user and own docs', () => {
  beforeEach( async () => {
    testUser2 = await helper.addTestUser('user2', 'u2@mainModule.com', 'jokusalainen')
    token2 = await helper.getToken('user2', 'jokusalainen')
    album2 = await helper.createDoc('albums', 'album 2', token2)
    picture2 = await helper.createDoc('pictures', 'picture 2', token2)
    category2 = await helper.createDoc('categories', 'category 2', token2)
    console.log('## Before testU 2: ', testUser2)
    await deleteDoc('users', testUser.id, token)
  })

  test('should delete albums with relation', async () => {
    // console.log('## Album 1: ', album1)
    // console.log('## Token 2: ', token2)
    nonExistingDoc('albums', album1.id)
    await api
      .get(`/api/albums/${album2.id}`)
      .expect(200)

    const all = await api.get('/api/albums')
    expect(all.body.length).toBe(1)
  })

  test('should delete picture with relation', async () => {
    nonExistingDoc('pictures', picture1.id)
    await api
      .get(`/api/pictures/${picture2.id}`)
      .expect(200)

    const all = await api.get('/api/pictures')
    expect(all.body.length).toBe(1)
  })

  test('should delete category with relation', async () => {
    nonExistingDoc('categories', category1.id)
    await api
      .get(`/api/categories/${category2.id}`)
      .expect(200)

    const all = await api.get('/api/categories')
    expect(all.body.length).toBe(1)
  })

})

describe('delete doc and user relation', () => {

  test('should delete album document and user\'s relation', async () => {
    await deleteDoc('albums', album1.id, token)
    const userNow = await api.get(`/api/users/${testUser.id}`)
    // console.log('UserNow: ', userNow.body)
    expect(userNow.body.albums).toStrictEqual([])
  })

  test('should delete category document and user\'s relation', async () => {
    await deleteDoc('categories', category1.id, token)
    const userNow = await api.get(`/api/users/${testUser.id}`)
    expect(userNow.body.categories).toStrictEqual([])
  })

  test('should delete picture document and user\'s relation', async () => {
    await deleteDoc('pictures', picture1.id, token)
    const userNow = await api.get(`/api/users/${testUser.id}`)
    expect(userNow.body.pictures).toStrictEqual([])
  })
})

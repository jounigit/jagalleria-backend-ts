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
  IAlbum,
  IUser } from '../types'

doAfterEach()
doAfterAll()

let testUser: IUser
let testUser2: IUser
let token: string
let token2: string
let album1: IAlbum
let album2: IAlbum

beforeEach( async () => {
  testUser = await helper.addTestUser()
  token = await helper.getToken()
  album1 = await helper.createDoc('albums', 'album 1', token)
})

//***************** user relation ***********************************/
describe('user relations', () => {
  let userNow: IUser
  beforeEach(async () => {
    const u1 = await api.get(`/api/users/${testUser.id}`)
    userNow = u1.body
  })

  test('should have album relation', async () => {
    expect(album1.user).toBe(testUser.id)
  })

  test('should have album in user', async () => {
    console.log('## User now:', userNow)
    expect(userNow.albums).toContain(album1.id)
  })
})

//***************** user delete relation ******************************/

describe('user deleting', () => {
  beforeEach( async () => {
    album2 = await helper.createDoc('albums', 'album 2', token)
    await helper.deleteDoc('users', testUser.id, token)
  })

  test('should delete albums with relation', async () => {
    // console.log('## TEST DELETE album: ', album1)
    helper.nonExistingDoc('albums', album1.id)
    helper.nonExistingDoc('albums', album2.id)
  })
})

describe('deleting user and own docs', () => {
  beforeEach( async () => {
    testUser2 = await helper.addTestUser('user2', 'u2@mainModule.com', 'jokusalainen')
    token2 = await helper.getToken('user2', 'jokusalainen')
    album2 = await helper.createDoc('albums', 'album 2', token2)
    console.log('## Before testU 2: ', testUser2)
    await helper.deleteDoc('users', testUser.id, token)
  })

  test('should delete albums with relation', async () => {
    // console.log('## Album 1: ', album1)
    // console.log('## Token 2: ', token2)
    helper.nonExistingDoc('albums', album1.id)
    await api
      .get(`/api/albums/${album2.id}`)
      .expect(200)

    const all = await api.get('/api/albums')
    expect(all.body.length).toBe(1)
  })
})

describe('delete doc and user relation', () => {

  test('should delete album document and user\'s relation', async () => {
    await helper.deleteDoc('albums', album1.id, token)
    const userNow = await api.get(`/api/users/${testUser.id}`)
    // console.log('UserNow: ', userNow.body)
    expect(userNow.body.albums).toStrictEqual([])
  })
})

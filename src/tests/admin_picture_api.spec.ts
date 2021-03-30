/* eslint-disable no-undef */
import supertest from 'supertest'
import helper from './test_helper'
import app from '../app'
const api = supertest(app)
import {
  doAfterEach,
  doAfterAll
} from './test-setup'
import { IPicture } from '../types'

doAfterEach()
doAfterAll()

let token: string
let picture1: IPicture

beforeEach( async () => {
  await helper.addTestUser()
  token = await helper.getToken()
  picture1 = await helper.createPicture('Kuva 1', token)
})

//***************** admin succeeds ******************************/

describe('authorized with a valid token', () => {
  // create
  test('succeeds adding new picture', async () => {
    await api
      .post('/api/pictures')
      .send({ title: 'Picture added' })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  // update
  test('succeeds update with valid id',  async  () => {
    const title = 'Updated'
    const newPicture = {
      title
    }

    const response = await api
      .put(`/api/pictures/${picture1.id}`)
      .send(newPicture)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const responseTitle = response.body.title
    expect(title).toContain(responseTitle)
  })

  // delete
  test('succeeds delete with valid id', async () => {
    const { body: atStart } = await api.get('/api/pictures')

    await api
      .delete(`/api/pictures/${picture1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const { body: atEnd } = await api.get('/api/pictures')

    expect(atEnd.length).toBe(atStart.length-1)
  })
})

//****************** fails ************************************/
// status code 401
describe('unauthorized fails with status 401 at protected routes', () => {

  test('fails add new',  async  () => {
    await api
      .post('/api/pictures')
      .send({
        title: 'Picture 1'
      })
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('fails update with valid id',  async  () => {
    await api
      .put(`/api/pictures/${picture1.id}`)
      .send({ title: 'Update' })
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('fails delete with valid id',  async  () => {
    await api
      .delete(`/api/pictures/${picture1.id}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})

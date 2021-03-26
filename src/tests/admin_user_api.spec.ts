/* eslint-disable no-undef */
import supertest from 'supertest'
import helper from './test_helper'
import app from '../app'
const api = supertest(app)
import {
  doAfterEach,
  doAfterAll
} from './test-setup'

doAfterEach()
doAfterAll()

let token
let testUser
const username = helper.username
const password = helper.password
const newUser = 'newuser'
const newEmail = 'new@mail.com'
const newPassword = 'newpass'

// beforeEach( async () => {
//   testUser = await helper.addTestUser()
//   token = await helper.getToken()
//   console.log('Before Test user: ', testUser, ' -token-', token)
// })


//********************** succeeds ******************************/

describe('Tests with valid email and password', () => {
  test('should login', async () => {
    testUser = await helper.addTestUser()
    const response = await api
      .post('/api/login')
      .send({
        username,
        password,
      })
      .expect(200)

    expect(response.body.user).toBe(username)
  })

  test('should signup new user', async () => {
    const response = await api
      .post('/api/users')
      .send({
        username: newUser,
        email: newEmail,
        password: newPassword
      })
      .expect(200)

    // console.log('Lgged in: ', response.body)
    expect(response.body.username).toBe(newUser)
  })

  test('should update user', async () => {
    testUser = await helper.addTestUser()
    token = await helper.getToken()
    console.log('Test user: ', testUser)
    const userId = testUser._id

    await api
      .put(`/api/users/${userId}`)
      .send({ username: 'uusiTyyppi' })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  test('should resign/delete user', async () => {
    testUser = await helper.addTestUser()
    token = await helper.getToken()
    console.log('Test user: ', testUser)
    const userId = testUser._id

    await api
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
  })

})





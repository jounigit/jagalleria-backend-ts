import supertest from 'supertest'
import helper from './test_helper'
import app from '../app'
const api = supertest(app)
import {
  doAfterEach,
  doAfterAll
} from './test-setup'
import Picture from '../models/picture'

doAfterEach()
doAfterAll()



beforeEach( async () => {
  await Picture.create(helper.initialPictures)
})

//****************** succeeds ************************************/
describe('Test with initial pictures', () => {
    test('succeeds return pictures as json', async () => {

      await api
      .get('/api/pictures')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    })

    test('all pictures are returned', async () => {
      const response = await api.get('/api/pictures')
  
      expect(response.body.length).toBe(2)
    })

    //** get one */ 
    test('succeeds view a specific picture', async () => {
      const allPics = await api.get('/api/pictures')
      console.log('All pics: ', allPics.body)

      const result = await api
        .get(`/api/pictures/${allPics.body[0].id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)


      // console.log('All pics res: ', result)
      expect(result.body).toEqual(allPics.body[0])
    })
  })

//****************** fails ************************************/
// status code 404

// status code 400
describe('if id is invalid', () => {
  test('fails with statuscode 400', async () => {

    await api
      .get(`/api/pictures/000`)
      .expect(400)
  })
})
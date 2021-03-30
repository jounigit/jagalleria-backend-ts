/* eslint-disable no-undef */
import supertest from 'supertest'
import helper from './test_helper'
import app from '../app'
const api = supertest(app)
import {
  doAfterEach,
  doAfterAll
} from './test-setup'
import { IAlbum, IPicture } from '../types'
import Album from '../models/album'

doAfterEach()
doAfterAll()

let token: string
let album1: IAlbum
let picture1: IPicture
let picture2: IPicture

const updateAlbum = async (albumID: string, pictureID: string) => {
  const res = await api
    .put(`/api/albums/${albumID}/${pictureID}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
  return res.body
}

const deleteAlbumPicture = async (albumID: string, pictureID: string) => {
  const res = await api
    .delete(`/api/albums/${albumID}/${pictureID}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
  return res.body
}

beforeEach( async () => {
  await helper.addTestUser()
  token = await helper.getToken()
  album1 = await helper.createDoc('albums', 'album 1', token)
  picture1 = await helper.createPicture('Kuva 12', token)
  picture2 = await helper.createPicture('Kuva 34', token)
})

// //***************** admin succeeds ******************************/
describe('make relation between album and pictures', () => {

  test('should have album with picture', async () => {
    const album1Now = await updateAlbum(album1.id, picture1.id)
    expect(picture1.id).toContain(album1Now.pictures)
  })

  test('should have album with 2 pictures', async () => {
    await updateAlbum(album1.id, picture1.id)
    const atEnd = await updateAlbum(album1.id, picture2.id)
    // console.log('End: ', atEnd)
    expect(atEnd.pictures.length).toBe(album1.pictures.length+2)
  })
})

// //***************** admin delete relation ******************************/
describe('delete relation after deleting picture', () => {

  test('delete picture and album not have picture', async () => {
    await updateAlbum(album1.id, picture1.id)
    await updateAlbum(album1.id, picture2.id)

    await api
      .delete(`/api/pictures/${picture1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const album1End = await Album.findById(album1.id)
    if (album1End)
      expect(album1End.pictures).toHaveLength(1)
  })

  test('delete relation by album', async () => {
    await updateAlbum(album1.id, picture1.id)
    await updateAlbum(album1.id, picture2.id)

    await deleteAlbumPicture(album1.id, picture1.id)
    await Album.findById(album1.id)
  })

})

// //***************** admin fails ******************************/
describe('admin fails', () => {
  test('should not save duplicates', async () => {
    await updateAlbum(album1.id, picture1.id)
    const albumNow = await updateAlbum(album1.id, picture1.id)

    expect(albumNow.pictures).toHaveLength(1)
  })
})

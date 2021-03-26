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
  IAlbum, ICategory
} from '../types'
import Album from '../models/album'
import Category from '../models/category'

doAfterEach()
doAfterAll()

let token: string
let album1: IAlbum
let album2: IAlbum
let category1: ICategory
let category2: ICategory

const updateAlbum = async (categoryID: string, albumID: string) => {
  const updated = await api
    .put(`/api/albums/${albumID}`)
    .send({ category: categoryID })
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
  console.log('Test album updated: ', updated.body)
  return updated.body
}

beforeEach( async () => {
  await helper.addTestUser()
  token = await helper.getToken()
  album1 = await helper.createDoc('albums', 'album 1', token)
  album2 = await helper.createDoc('albums', 'album 2', token)
  category1 = await helper.createDoc('categories', 'category 1', token)
  category2 = await helper.createDoc('categories', 'category 2', token)
})

//***************** admin succeeds ******************************/
describe('make relation between album and category', () => {

  test('should have album with category', async () => {
    console.log('Cat 1: ', category1)
    const album1Now = await updateAlbum(category1.id, album1.id)
    expect(category1.id).toEqual(album1Now.category)
  })

  test('should have category with album', async () => {
    const album1Now = await updateAlbum(category1.id, album1.id)
    const categoryNow = await Category.findById(category1.id)
    if (categoryNow)
    expect(album1Now.id).toContain(categoryNow.albums)
  })
})

describe('make relation between 2 albums and category', () => {

  test('should have category with 2 albums', async () => {
    const atStart = await Category.findById(category1.id)
    console.log('# At start: ', atStart)
    await updateAlbum(category1.id, album1.id) // add album to category
    await updateAlbum(category1.id, album2.id) // add album to category
    const atEnd = await Category.findById(category1.id)
    console.log('# At end: ', atEnd)
    if (atEnd)
    expect(atEnd.albums.length).toBe(category1.albums.length+2)
  })
})

//***************** admin update relation ******************************/
describe('update relation', () => {

  beforeEach( async () => {
    await updateAlbum(category1.id, album1.id) // add album to category
  })

  test('should have album with new category', async () => {
    const album1Now = await updateAlbum(category2.id, album1.id)
    await Category.findById(category1.id)
    await Category.findById(category2.id)
    expect(category1.id).not.toEqual(album1Now.category)
    expect(category2.id).toEqual(album1Now.category)
  })

  test('should not have relation with old category', async () => {
    await updateAlbum(category2.id, album1.id)
    // console.log('Album 1: ',  album1Now)
    const atEnd = await Category.findById(category1.id)
    if (atEnd)
    expect(atEnd.albums.length).toBe(0)
  })
})

//***************** admin delete relation ******************************/
describe('delete relation after deleting album or category', () => {

  test('should not have album with category', async () => {
    const album1Start = await updateAlbum(category1.id, album1.id)
    const alCategory = album1Start.category.toString()
    // console.log('album 1 start: ',  album1Start)

    await api
      .delete(`/api/categories/${category1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const album1End = await Album.findById(album1.id)
    if (album1End)
    expect(album1End.category?.toString()).not.toBe(alCategory)
  })

  test('should not have category with album', async () => {
    await await updateAlbum(category1.id, album1.id)

    await api
      .delete(`/api/albums/${album1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const categoryNow = await Category.findById(category1.id)
    if (categoryNow)
    expect(categoryNow.albums.length).toBe(0)
  })
})






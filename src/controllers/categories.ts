import { Request, Response } from 'express'
// import jwt from 'jsonwebtoken'
import Category, { CategoryDocument } from '../models/category'
import User from '../models/user'
import { accessGranted } from '../utils/accessControl'
import { addToUser, IArrayName } from './controllerHelpers'
interface CategoryParams {
    title: string
    content?: string
    albums?: string
}

//******************* Get all ***********************************/
const getAll = async (_req: Request, res: Response): Promise<void> => {
  const categories = await Category.find()
  res.send(categories)
}

//******************* Get one ***********************************/
const getOne = async (req: Request, res: Response): Promise<CategoryDocument | unknown> => {
  const category = await Category.findById(req.params.id)

  if (!category) return res.status(404).send({ error: 'Not Found' })
  return res.send(category)}

//******************* Create new ***********************************/
const createOne = async (req: Request, res: Response): Promise<CategoryDocument | unknown> => {
  const { title, content }: CategoryParams = req.body

  if (!req.user) return res.sendStatus(403)
  const userID = req.user.id
  const user = await User.findById(userID)

  const categoryToSave = new Category({
    title,
    content,
    user: userID
  })

  const savedDoc = await categoryToSave.save()

  if (user) addToUser(user, savedDoc._id, IArrayName.Categories)

  return res.json(savedDoc.toJSON())
}

//******************* Update one ***********************************/
const updateOne = async (req: Request, res: Response): Promise<CategoryDocument | unknown> => {
  const category = await Category.findById(req.params.id)
  if (!category) return res.status(404).send({ error: 'Not Found' })
  if (!req.user) return res.sendStatus(403)

  const permission = accessGranted(req.user.id, category.user, req.user.role, 'category')
  console.log('## Permission: ', permission, ' -Granted- ', permission.granted)
  if (!permission.granted) return res.sendStatus(403)

  await category.updateOne(req.body)
  const updatedDoc = await Category.findById(req.params.id)
  // console.log('Category updated:', updatedDoc)
  if (!updatedDoc) {
    return res.status(404).send({ error: 'Not Found' })
  }

  return res.json(updatedDoc.toJSON())
}

//******************* Delete one ***********************************/
const deleteOne = async (req: Request, res: Response): Promise<CategoryDocument | unknown> => {
  const category = await Category.findById(req.params.id)
  if (!category) return res.status(404).send({ error: 'Not Found' })
  if (!req.user) return res.sendStatus(403)

  const permission = accessGranted(req.user.id, category.user, req.user.role, 'category')
  if (!permission.granted) return res.sendStatus(403)

  await category.remove()
  return res.status(204).end()
}

export default {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne
}
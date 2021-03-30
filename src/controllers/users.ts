/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/user'

interface NewUserParams {
    username: string
    email: string
    password: string
    role?: string
}
interface UpdateUserParams {
    username?: string
    email?: string
}

//******************* get all ***********************************/
const getUsers = async (_req: Request, res: Response) => {
  const users = await User.find()
  console.log('Res users: ', users)
  res.send(users)
}

//******************* Get one ***********************************/
const getUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).send({ error: 'Not Found' })
  }

  return res.send(user)
}

//******************* Create new ***********************************/
const createUser = async (req: Request, res: Response) => {
  const body: NewUserParams = req.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    email: body.email,
    passwordHash,
    role: body.role || 'editor'
  })

  const savedUser = await user.save()
  console.log('Category saved:', savedUser)
  return res.json(savedUser.toJSON())
}

//******************* Update one ***********************************/
const updateUser = async (req: Request, res: Response) => {
  const body: UpdateUserParams = req.body
  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).send({ error: 'Not Found' })
  }

  await user.updateOne(body)
  const updatedDoc = await User.findById(req.params.id)
  console.log('User updated:', updatedDoc)
  if (!updatedDoc) {
    return res.status(404).send({ error: 'Not Found' })
  }

  return res.json(updatedDoc.toJSON())
}

//******************* Delete one ***********************************/
const deleteUser = async (req: Request, res: Response) => {
  console.log('Delete: ', req.params)
  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).send({ error: 'Not Found' })
  }

  await user.remove()
  return res.status(204).end()
}

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
}
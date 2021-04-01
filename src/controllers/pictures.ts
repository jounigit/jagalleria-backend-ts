/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Request, Response } from 'express'
import Picture from '../models/picture'
import User from '../models/user'

interface PictureParams {
  title: string
  image?: string
  thumb?: string
  landscape?: string
  publicID?: string
}

//******************* Get all ***********************************/
const getAll = async (_req: Request, res: Response) => {
  const pictures = await Picture.find({})

  console.log('Res pics: ', pictures)
  res.send(pictures)
}

//******************* Get one ***********************************/
const getOne = async (req: Request, res: Response) => {
  const picture = await Picture.findById(req.params.id)

  if (!picture) {
    return res.status(404).send({ error: 'Not Found' })
  }

  return res.send(picture)
}

//******************* Create new ***********************************/
const createOne = async (req: Request, res: Response) => {
  const { title, image, thumb, landscape, publicID }: PictureParams = req.body

  if (!req.user) return res.sendStatus(403)
  const userID = req.user.id
  const user = await User.findById(userID)

  const toSave = new Picture({
    title,
    image,
    thumb,
    landscape,
    publicID,
    user: req.user.id
  })

  const savedDoc = await toSave.save()
  if (!savedDoc) return res.status(404).send({ error: 'Not Found' })

  if (!user) return res.status(404).send({ error: 'Could`t update user' })
  user.pictures = user.pictures.concat(savedDoc._id)
  await user.save()

  // console.log('Picture saved:', savedDoc)
  return res.json(savedDoc.toJSON())
}

//******************* Update one ***********************************/
const updateOne = async (req: Request, res: Response) => {
  const picture = await Picture.findById(req.params.id)

  if (!picture) {
    return res.status(404).send({ error: 'Not Found' })
  }

  await picture.updateOne(req.body)
  const updatedDoc = await Picture.findById(req.params.id)
  console.log('Picture updated:', updatedDoc)
  if (!updatedDoc) {
    return res.status(404).send({ error: 'Not Found' })
  }

  return res.json(updatedDoc.toJSON())
}

//******************* Delete one ***********************************/
const deleteOne = async (req: Request, res: Response) => {
  console.log('Delete: ', req.params)
  const picture = await Picture.findById(req.params.id)

  if (!picture) {
    return res.status(404).send({ error: 'Not Found' })
  }

  await picture.remove()
  return res.status(204).end()
}

export default {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne
}
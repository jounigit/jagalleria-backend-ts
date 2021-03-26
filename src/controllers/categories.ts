import { Request, Response} from 'express'
// import jwt from 'jsonwebtoken'
import Category from '../models/category'
import User from '../models/user'
interface CategoryParams {
    title: string
    content?: string
    albums?: string
}

//******************* Get all ***********************************/
const getAll = async (_req: Request, res: Response) => {
    const categories = await Category.find()

    res.send(categories)
}

//******************* Get one ***********************************/
const getOne = async (req: Request, res: Response) => {
    const category = await Category.findById(req.params.id)

    if (!category) return res.status(404).send({ error: 'Not Found' })
    return res.send(category)
}

//******************* Create new ***********************************/
const createOne = async (req: Request, res: Response) => {
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
    if (!savedDoc) return res.status(404).send({ error: 'Not Found' })

    if (!user) return res.status(404).send({error: 'Could`t update user'})
    user.categories = user.categories.concat(savedDoc._id)
    await user.save()

    // console.log('Category saved:', savedCategory)
    return res.json(savedDoc.toJSON())
}

//******************* Update one ***********************************/
const updateOne = async (req: Request, res: Response) => {
    const category = await Category.findById(req.params.id)

    if (!category) return res.status(404).send({ error: 'Not Found' })

    await category.updateOne(req.body)
    const updatedDoc = await Category.findById(req.params.id)
    // console.log('Category updated:', updatedDoc)
    if (!updatedDoc) { 
        return res.status(404).send({ error: 'Not Found' })
    }

    return res.json(updatedDoc.toJSON()) 
}

//******************* Delete one ***********************************/
const deleteOne = async (req: Request, res: Response) => {
    const category = await Category.findById(req.params.id)

    if (!category) return res.status(404).send({ error: 'Not Found' })

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
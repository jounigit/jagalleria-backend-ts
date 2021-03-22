import { Request, Response} from 'express'
import Category from '../models/category'
import { NewCategory } from '../types'

const user = {
    id: '5ee7466af1c4e01d303f9dc5'
}
//******************* Get all ***********************************/
const getAll = async (_req: Request, res: Response) => {
    const categories = await Category.find()
        // .populate( 'user', { username: 1 } )

    res.send(categories)
}

//******************* Get one ***********************************/
const getOne = async (req: Request, res: Response) => {
    const category = await Category.findById(req.params.id)
    return res.send(category)
}

// return res.status(404).send({ error: 'Not Found' })
//******************* Create new ***********************************/
const createOne = async (req: Request, res: Response) => {
    const { title, content }: {title:string; content:string} = req.body

    const newCategory: NewCategory = {
        title,
        content,
        user: user.id
    }

    const categoryToSave = new Category(newCategory)

    const savedCategory = await categoryToSave.save()
    console.log('Category saved:', savedCategory)
    return res.json(savedCategory.toJSON())
}

//******************* Update one ***********************************/
const updateOne = async (req: Request, res: Response) => {
    const category = await Category.findById(req.params.id)

    if (!category) {
        return res.status(404).send({ error: 'Not Found' })
    }

    await category.updateOne(req.body)
    const updatedDoc = await Category.findById(req.params.id)
    console.log('Category updated:', updatedDoc)
    if (!updatedDoc) { 
        return res.status(404).send({ error: 'Not Found' })
    }

    return res.json(updatedDoc.toJSON()) 
}

//******************* Delete one ***********************************/
const deleteOne = async (req: Request, res: Response) => {
    const category = await Category.findById(req.params.id)

    // if (!category) { return }
    if (category) {
        await category.remove()
        return res.status(204).end()
    }
}

export default {
    getAll,
    getOne,
    createOne,
    updateOne,
    deleteOne
}
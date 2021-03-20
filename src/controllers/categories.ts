import { Request, Response} from 'express'
import categoryModel from '../models/category'

const getCategories = (_req: Request, res: Response) => {
    console.log('Res categories: ', )
    categoryModel.find()
    .then(categories => {
        console.log('Res categories: ', categories)
        res.send(categories)
    })
}

export default {
    getCategories
}
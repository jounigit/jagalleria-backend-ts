import express from 'express'
// import categoryModel from '../models/category'
import categoryController from '../controllers/categories'
// import { Category } from '../types'

const router = express.Router()

router.get('/', categoryController.getCategories)

// router.get('/', (_req, res) => {
//     (categories.getCategories())
//     .then((categories: any) => {
//         console.log('Res categories: ', categories)
//         res.send(categories)
//     })
// })

export default router
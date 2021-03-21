import express from 'express'
// import categoryModel from '../models/category'
import pictureController from '../controllers/pictures'
// import { Category } from '../types'

const router = express.Router()

router.get('/', pictureController.getPictures)

export default router
import express from 'express'
// import categoryModel from '../models/category'
import userController from '../controllers/users'
// import { Category } from '../types'

const router = express.Router()

router.get('/', userController.getUsers)
router.post('/', userController.createUser)

export default router
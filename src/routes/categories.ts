import express from 'express'
import categoryController from '../controllers/categories'

const router = express.Router()

router.get('/', categoryController.getAll)
router.get('/:id', categoryController.getOne)
router.post('/', categoryController.createOne)
router.put('/:id', categoryController.updateOne)
router.delete('/:id', categoryController.deleteOne)


export default router
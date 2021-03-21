import express from 'express'
import albumController from '../controllers/albums'

const router = express.Router()

router.get('/', albumController.getAlbums)
router.get('/:id', albumController.getOne)
router.post('/', albumController.createOne)
router.delete('/:id', albumController.deleteOne)

export default router
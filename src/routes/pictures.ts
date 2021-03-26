import express from 'express'
import jwtAuth from 'express-jwt'
import config from '../utils/config'
import pictureController from '../controllers/pictures'

const router = express.Router()

const routeAuth = jwtAuth({ secret: `${config.JWTSecret}`, algorithms: ['HS256'] })

router.get('/', pictureController.getAll)
router.get('/:id', pictureController.getOne)
router.post('/', routeAuth, pictureController.createOne)
router.put('/:id', routeAuth, pictureController.updateOne)
router.delete('/:id', routeAuth, pictureController.deleteOne)

export default router
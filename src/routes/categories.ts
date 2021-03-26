import express from 'express'
import jwtAuth from 'express-jwt'
import config from '../utils/config'
import categoryController from '../controllers/categories'

const router = express.Router()

const routeAuth = jwtAuth({ secret: `${config.JWTSecret}`, algorithms: ['HS256'] })

router.get('/', categoryController.getAll)
router.get('/:id', categoryController.getOne)
router.post('/', routeAuth, categoryController.createOne)
router.put('/:id', routeAuth, categoryController.updateOne)
router.delete('/:id', routeAuth, categoryController.deleteOne)


export default router
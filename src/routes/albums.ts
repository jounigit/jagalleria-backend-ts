import express from 'express'
import jwtAuth from 'express-jwt'
import config from '../utils/config'
import albumController from '../controllers/albums'

const router = express.Router()

const routeAuth = jwtAuth({ secret: `${config.JWTSecret}`, algorithms: ['HS256'] })


router.get('/', albumController.getAlbums)
router.get('/:id', albumController.getOne)
router.post('/', routeAuth, albumController.createOne)
router.put('/:id', routeAuth, albumController.updateOne)
router.delete('/:id', routeAuth, albumController.deleteOne)
router.put('/:id/:picture', routeAuth, albumController.updateAlbumPicture)
router.delete('/:id/:picture', routeAuth, albumController.deleteAlbumPicture)

export default router
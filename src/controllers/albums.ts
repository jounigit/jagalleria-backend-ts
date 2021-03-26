import { Request, Response} from 'express'
// import { isNullOrUndefined } from 'node:util'
import Album from '../models/album'
import Category from '../models/category'
import User from '../models/user'
interface AlbumParams {
    title: string
    content?: string
    category?: string
}
//******************* Get all ***********************************/
const getAlbums = async (_req: Request, res: Response) => {
    const albums = await Album
        .find()
        .populate('user', { username: 1 })

    console.log('Res albums: ', albums)
    res.send(albums)
}

//******************* Get one ***********************************/
const getOne = async (req: Request, res: Response) => {
    const album = await Album.findById(req.params.id)

    if (!album) {
        return res.status(404).send({ error: 'Not Found' })
    }

    return res.send(album)
}

//****************** helpers ***********************/
const addToCategory = async (categoryID: string, albumID: string) => {
    const category = await Category.findById(categoryID)
    if (category !== null) {
        category.albums = category.albums.concat(albumID)
        await category.save()
    }
}
const removeFromCategory = async (categoryID: string, albumID: string) => {
    const category = await Category.findById(categoryID)
    console.log('RM func:', category)
    if (category !== null) {
        category.albums = category.albums.filter(item => item.toString() !== albumID)
        console.log('RM func after:', category)
        await category.save()
    }
}
//******************* Create new ***********************************/
const createOne = async (req: Request, res: Response) => {
    const { title, content, category }: AlbumParams = req.body

    if (!req.user) return res.sendStatus(403)
    const userID = req.user.id
    const user = await User.findById(userID)

    const toSave = new Album({
        title,
        content,
        category,
        user: req.user.id
    })

    const savedDoc = await toSave.save()

    // update category document
    if( category !== undefined  ) addToCategory(category, savedDoc.id)

    if (!user) return res.status(404).send({error: 'Could`t update user'})
    user.albums = user.albums.concat(savedDoc._id)
    await user.save()

    return res.json(savedDoc.toJSON())
}

//******************* Update one ***********************************/
const updateOne = async (req: Request, res: Response) => {
    const { category }: AlbumParams = req.body
    const album = await Album.findById(req.params.id)
    const albumCategory = album?.category

    if (!album) {
        return res.status(404).send({ error: 'Not Found' })
    }

    if(category && albumCategory && category !== albumCategory) {
        removeFromCategory(albumCategory, album.id)
    }

    await album.updateOne(req.body)

    if( category && albumCategory === undefined ) {
        addToCategory(category, album.id)
    }

    const updatedDoc = await Album.findById(req.params.id)
    console.log('Album updated:', updatedDoc)
    if (!updatedDoc) { 
        return res.status(404).send({ error: 'Not Found' })
    }

    return res.json(updatedDoc.toJSON()) 
}

//******************* Delete one ***********************************/
const deleteOne = async (req: Request, res: Response) => {
    const album = await Album.findById(req.params.id)

    if (!album) return res.status(404).send({ error: 'Not Found' })

    await album.remove()

    console.log('# Album Deleted: ')
    return res.status(204).end()
}

export default {
    getAlbums,
    getOne,
    createOne,
    updateOne,
    deleteOne
}
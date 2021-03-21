import { Request, Response} from 'express'
import Album from '../models/album'
import { NewAlbum } from '../types'

const user = {
    id: '5ee7466af1c4e01d303f9dc5'
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

//******************* Create new ***********************************/
const createOne = async (req: Request, res: Response) => {
    const { title, content }: {title:string; content:string} = req.body

    const newDoc: NewAlbum = {
        title,
        content,
        user: user.id
    }

    const toSave = new Album(newDoc)

    const savedDoc = await toSave.save()
    console.log('Album saved:', savedDoc)
    return res.json(savedDoc.toJSON())
}

//******************* Delete one ***********************************/
const deleteOne = async (req: Request, res: Response) => {
    console.log('Delete: ', req.params)
    const album = await Album.findById(req.params.id)

    if (!album) {
        return res.status(404).send({ error: 'Not Found' })
    }

    await album.remove()
    return res.status(204).end()
}

export default {
    getAlbums,
    getOne,
    createOne,
    deleteOne
}
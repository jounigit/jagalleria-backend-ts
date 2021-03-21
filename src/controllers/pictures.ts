import { Request, Response} from 'express'
import Picture from '../models/picture'

const getPictures = async (_req: Request, res: Response) => {
    const pictures = await Picture.find()

    console.log('Res albums: ', pictures)
    res.send(pictures)
}

export default {
    getPictures
}
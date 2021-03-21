import { Request, Response} from 'express'
import User from '../models/user'

const getUsers = async (_req: Request, res: Response) => {
    const users = await User.find()


    console.log('Res users: ', users)
    res.send(users)
}

export default {
    getUsers
}
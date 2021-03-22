import { Request, Response} from 'express'
import bcrypt from 'bcrypt'
import User from '../models/user'

interface UserParams {
    username: string
    email: string
    password: string
    role?: string
}

//******************* get all ***********************************/
const getUsers = async (_req: Request, res: Response) => {
    const users = await User.find()
    console.log('Res users: ', users)
    res.send(users)
}

//******************* Create new ***********************************/
const createUser = async (req: Request, res: Response) => {
    const body: UserParams = req.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
  
    const user = new User({
      username: body.username,
      email: body.email,
      passwordHash,
      role: body.role || 'editor'
    })

    const savedUser = await user.save()
    console.log('Category saved:', savedUser)
    return res.json(savedUser.toJSON())
    
}

export default {
    getUsers,
    createUser
}
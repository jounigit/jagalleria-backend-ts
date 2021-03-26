import { Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../models/user'


// loginRouter.get('/', (_req: Request, res: Response) => {
//   console.log('ME OK!')
//   res.send('OK')
// })

//******************* Login ***********************************/

const login = async (req: Request, res: Response) => {
  const { username, email, password } = req.body
  let user
  let passwordCorrect

  if (username) {
    user = await User.findOne({ username })
  }

  if (email) {
    user = await User.findOne({ email: email })
  }

  if (user) {
    passwordCorrect = await bcrypt.compare(password, user.passwordHash)
  }

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid email or password'
    })
  }

  const userForToken = {
    username: user.username,
    role: user.role,
    id: user._id
  }

  // eslint-disable-next-line no-undef
  const token = jwt.sign(userForToken, `${process.env.JWT_SECRET}`)

  return res
    .status(200)
    .send({
      token,
      user: user.username,
      email: user.email,
      id: user._id,
      role: user.role
    })
}

export default { login }
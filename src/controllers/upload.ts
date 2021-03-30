import { Request, Response} from 'express'
import Picture from '../models/picture'
import User from '../models/user'
import cloudinary from 'cloudinary'
import { addToUser, IArrayName, getOrientation, makeUrl, setOptions, paramsToMakeUrls } from './controllerHelpers'
import { UploadedFile } from 'express-fileupload'

cloudinary.v2.config({
  // eslint-disable-next-line no-undef
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // eslint-disable-next-line no-undef
  api_key: process.env.CLOUDINARY_API_KEY,
  // eslint-disable-next-line no-undef
  api_secret: process.env.CLOUDINARY_API_SECRET
})


//******************* Upload picture ***********************************/
const uploadImage = async (req: Request, res: Response) => {
  if (!req.user) return res.sendStatus(403)
  const userID = req.user.id
  const user = await User.findById(userID)

  if (!req.files) return res.status(400).send({ error: 'No file Found' })
  const file = req.files.image as UploadedFile
  const width = 1600
  const height = 1400
  let pictureToSave

  const orientation = await getOrientation(file.tempFilePath)
  const options = orientation && setOptions(width, height, orientation)

  const newPic = await cloudinary.v2.uploader.upload(file.tempFilePath, options, (err, result) => {
    if (err) res.send({ error: 'could not upload image' })
    return result
  })

  const urlParams = paramsToMakeUrls(newPic.width)

  const thumbUrl = makeUrl(urlParams.transThumb, newPic.resource_type, newPic.type, newPic.public_id, newPic.format)
  const lanToLanUrl = makeUrl(urlParams.transLanToLan, newPic.resource_type, newPic.type, newPic.public_id, newPic.format)
  const portToLanUrl = makeUrl(urlParams.transPortToLan, newPic.resource_type, newPic.type, newPic.public_id, newPic.format)

  pictureToSave = new Picture({
    title: file.name,
    image: newPic.secure_url,
    thumb: thumbUrl,
    landscape: (orientation === 'isPortrait') ? portToLanUrl : lanToLanUrl,
    publicID: newPic.public_id,
    user: userID
  })

  const savedDoc = await pictureToSave.save()
  if(user) addToUser(user, savedDoc._id, IArrayName.Pictures)

   return res.json(savedDoc.toJSON())
}

export default {uploadImage}

// ********************************************************************************


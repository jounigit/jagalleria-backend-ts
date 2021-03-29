import { Request, Response} from 'express'
import Picture from '../models/picture'
import User from '../models/user'
import cloudinary from 'cloudinary'
import { addToUser, ArrayName, getOrientation, makeUrl, setOptions } from './controllerHelpers'
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

  const ratio = 3/4
  const newPicWidth = newPic.width
  const newLanPicWidth = 1000
  const newPortToLanHeight = Math.floor(newPicWidth * ratio)
  const newLanToLanHeight = Math.floor(newLanPicWidth * ratio)
  const transThumb = 'w_500,h_500,c_fit'
  const transPortToLan = `w_${newPicWidth},h_${newPortToLanHeight},c_fill,g_auto`
  const transLanToLan = `w_${newLanPicWidth},h_${newLanToLanHeight},c_fill,g_auto`

  const thumbUrl = makeUrl(transThumb, newPic.resource_type, newPic.type, newPic.public_id, newPic.format)
  const lanToLanUrl = makeUrl(transLanToLan, newPic.resource_type, newPic.type, newPic.public_id, newPic.format)
  const portToLanUrl = makeUrl(transPortToLan, newPic.resource_type, newPic.type, newPic.public_id, newPic.format)

  pictureToSave = new Picture({
    title: file.name,
    image: newPic.secure_url,
    thumb: thumbUrl,
    landscape: (orientation === 'isPortrait') ? portToLanUrl : lanToLanUrl,
    publicID: newPic.public_id,
    user: userID
  })

  const savedDoc = await pictureToSave.save()
  if(user) addToUser(user, savedDoc._id, ArrayName.Pictures)

   return res.json(savedDoc.toJSON())
}

export default {uploadImage}

// ********************************************************************************
// picturesRouter.post('/upload', routeAuth, async (request, response) => {
//   const file = request.files.image
//   console.log('Original: ', file)
//   const userID = request.user.id
//   const width = 1600
//   const height = 1400
//   let pictureToSave

//   const user = await User.findById(userID)
//   console.log('User: ', user)
//   const orientation = await getOrientation(file.tempFilePath)

//   const options = orientation && await setOptions(width, height, orientation)

//   const newPic = await cloudinary.uploader.upload(file.tempFilePath, options, (error, result) => {
//     if (error) response.send({ error: 'could not upload image' })
//     return ({ result })
//   })

//   const ratio = 3/4
//   const newPicWidth = newPic.width
//   const newLanPicWidth = 1000
//   const newPortToLanHeight = Math.floor(newPicWidth * ratio)
//   const newLanToLanHeight = Math.floor(newLanPicWidth * ratio)

//   const makeUrl = (trans, res_type, type, p_id, format) => {
//     // eslint-disable-next-line no-undef
//     const url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}`
//     // eslint-disable-next-line quotes
//     return `${url}/${res_type}/${type}/${trans}/${p_id}.${format}`
//   }

//   const transThumb = 'w_500,h_500,c_fit'
//   const transPortToLan = `w_${newPicWidth},h_${newPortToLanHeight},c_fill,g_auto`
//   const transLanToLan = `w_${newLanPicWidth},h_${newLanToLanHeight},c_fill,g_auto`

//   const thumbUrl = makeUrl(transThumb, newPic.resource_type, newPic.type, newPic.public_id, newPic.format)
//   const lanToLanUrl = makeUrl(transLanToLan, newPic.resource_type, newPic.type, newPic.public_id, newPic.format)
//   const portToLanUrl = makeUrl(transPortToLan, newPic.resource_type, newPic.type, newPic.public_id, newPic.format)


//   pictureToSave = new Picture({
//     title: file.name,
//     image: newPic.secure_url,
//     thumb: thumbUrl,
//     landscape: (orientation === 'isPortrait') ? portToLanUrl : lanToLanUrl,
//     publicID: newPic.public_id,
//     user: user.id
//   })

//   const savedPicture = await pictureToSave.save()
//   user.pictures = user.pictures.concat(savedPicture._id)
//   await user.save()

//   const newSavedPicture = await Picture
//     .findById(savedPicture._id)
//     .populate('user', { username: 1, email: 1 })


//   // console.log('UUSI KUVA: ', newSavedPicture)

//   return response.json(newSavedPicture.toJSON())
// })


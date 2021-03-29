import { UserDocument } from "../models/user";

const { promisify } = require('util')
const sizeOf = promisify(require('image-size'))

export const uniqStringArray = (arrArg: string[]) => {
    return arrArg.filter((elem, pos, arr) => {
      return arr.indexOf(elem) == pos;
    })
}

//******************* Upload helpers ***********************************/
export const uploadOptions = (width: number | string, height: number | string) => {
  return {
    public_id: `${Date.now()}`,
    width,
    height,
    crop: 'scale'
  }
}

export const getOrientation = async (file: string) => {
  try {
    const dimensions = await sizeOf(file)
    console.log('Dims: ', dimensions)
    return dimensions.width < dimensions.height ? 'isPortrait' : 'isLandscape'
  } catch (err) {
    console.error(err)
    return
  }
}

export const setOptions =  (width: number | string, height: number | string, orientation: string) => {
  const ops = orientation === 'isLandscape' ?
    uploadOptions(width, '') :
    uploadOptions('', height)
  return ops
}

export const makeUrl = (trans: string, restype: string, type: string, pid: string, format: string) => {
  // eslint-disable-next-line no-undef
  const url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}`
  // eslint-disable-next-line quotes
  return `${url}/${restype}/${type}/${trans}/${pid}.${format}`
}

export enum ArrayName {
  Albums = 'albums',
  Categories = 'categories',
  Pictures = 'pictures'
} 
// //*********** Add to user document ******************************/
export const addToUser = async (user: UserDocument, docID: string, arrName: ArrayName) => {
  // const user = await User.findById(userID)
  // if (!user) return 'User not found'
  if (arrName === 'albums') {
    user.albums = user.albums.concat(docID)
      return await user.save() 
  } else if (arrName === 'categories') {
    user.categories = user.categories.concat(docID)
    return await user.save() 
  } else {
    user.pictures = user.pictures.concat(docID)
    return await user.save() 
  }
}

// export const addToUser = async (user: UserDocument, docID: string, arrName: ArrayName) => {
//   // const user = await User.findById(userID)
//   // if (!user) return 'User not found'
//   switch (arrName) {
//     case 'albums':
//       user.albums = user.albums.concat(docID)
//       return await user.save() 
//     case 'categories':
//       user.categories = user.categories.concat(docID)
//       return await user.save() 
//     case 'pictures':
//       user.pictures = user.pictures.concat(docID)
//       return await user.save() 
//     }
// }

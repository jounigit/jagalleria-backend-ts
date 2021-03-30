/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const info = (...params: string[]) => {
  console.log(...params)
  return
  // eslint-disable-next-line no-undef
  // if (process.env.NODE_ENV !== 'test') {
  //   console.log(...params)
  // }
}

const error = (...params: string[]) => {
  console.error(...params)
  return
}

export default {
  info, error
}
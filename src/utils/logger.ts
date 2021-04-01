
const info = (...params: string[]): void => {
  console.log(...params)

  // eslint-disable-next-line no-undef
  // if (process.env.NODE_ENV !== 'test') {
  //   console.log(...params)
  // }
}

const error = (...params: string[]): void => {
  console.error(...params)
}

export default {
  info, error
}
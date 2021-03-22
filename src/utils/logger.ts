const info = (...params: String[]) => {
    console.log(...params)
    return
    // eslint-disable-next-line no-undef
    // if (process.env.NODE_ENV !== 'test') {
    //   console.log(...params)
    // }
}

const error = (...params: String[]) => {
    console.error(...params)
    return
  }

export default {
    info, error
}
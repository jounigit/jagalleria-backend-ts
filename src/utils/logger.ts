const info = (...params: String[]) => {
    console.log(...params)
    // eslint-disable-next-line no-undef
    // if (process.env.NODE_ENV !== 'test') {
    //   console.log(...params)
    // }
}

export default {
    info
}
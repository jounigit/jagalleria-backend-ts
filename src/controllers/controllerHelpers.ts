export const uniqStringArray = (arrArg: string[]) => {
    return arrArg.filter((elem, pos, arr) => {
      return arr.indexOf(elem) == pos;
    })
}
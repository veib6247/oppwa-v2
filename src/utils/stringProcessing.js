/**
 * process array to fit into textarea
 * @param {Array} defaultParams
 * @returns String
 */
export const processParameters = (defaultParams) => {
  // init blank string
  let generatedFields = ''

  // loop through each item in array
  defaultParams.forEach((item, index, array) => {
    generatedFields += `${item}`

    // catch last array iteration
    if (index !== array.length - 1) {
      generatedFields += `\n`
    }
  })

  return generatedFields
}

/**
 * process array into data string of the selected brands
 * @param {array} arrSelectedBrands
 * @returns string
 */
export const parseBrands = (arrSelectedBrands) => {
  // init blank string
  let brandList = ''

  // loop through each item for processing
  arrSelectedBrands.forEach((item, index, array) => {
    // if on last item, do not add whitespace at the end
    if (index === array.length - 1) {
      brandList += `${item}`
    } else {
      brandList += `${item} `
    }
  })

  // console.info(`Selected brands: ${brandList}`)
  return brandList
}

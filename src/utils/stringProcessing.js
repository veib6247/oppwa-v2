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

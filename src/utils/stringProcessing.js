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

/**
 * @returns Object
 * object that contains the default parameters for each available s2s trx
 */
export const defaultParams = {
  server: [
    'entityId=8a8294174b7ecb28014b9699220015ca',
    'amount=1.00',
    'currency=EUR',
    'paymentType=DB',
    'paymentBrand=VISA',
    'card.number=4711100000000000',
    'card.holder=Bruce Wayne',
    'card.expiryMonth=02',
    'card.expiryYear=2034',
    'card.cvv=123',
    'billing.city=city1',
    'billing.country=PH',
    'billing.street1=strt1',
    'billing.postcode=1610',
    'customer.email=test@test.com',
    'customer.givenName=Test',
    'customer.surname=Tester',
    'customer.ip=192.168.0.1',
    'customer.browser.acceptHeader=text/html',
    'customer.browser.screenColorDepth=48',
    'customer.browser.javaEnabled=false',
    'customer.browser.language=en-US',
    'customer.browser.screenHeight=1200',
    'customer.browser.screenWidth=1600',
    'customer.browser.timezone=-480',
    'customer.browser.challengeWindow=5',
    'customer.browser.userAgent=Mozilla/4.0 (MSIE 6.0; Windows NT 5.0)',
  ],
  capture: [
    'entityId=8a8294174b7ecb28014b9699220015ca',
    'amount=1.00',
    'currency=EUR',
    'paymentType=CP',
  ],

  refund: [
    'entityId=8a8294174b7ecb28014b9699220015ca',
    'amount=1.00',
    'currency=EUR',
    'paymentType=RF',
  ],

  reversal: ['entityId=8a8294174b7ecb28014b9699220015ca', 'paymentType=RV'],

  receipt: [
    'entityId=8a8294174b7ecb28014b9699220015ca',
    'amount=1.00',
    'currency=EUR',
    'paymentType=RC',
  ],
}

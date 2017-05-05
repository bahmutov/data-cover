function isNumber(a) {
  return typeof a === 'number'
}

function isEven(a) {
  return a % 2 === 0
}

function getEvenNumbers (list) {
  return list.filter(isNumber).map(isEven)
}

module.exports = {getEvenNumbers}

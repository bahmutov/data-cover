const Rx = require('rxjs/Rx')

function isNumber(a) {
  return typeof a === 'number'
}

function double(a) {
  return a * a
}

function neverCalled(a, b) {
  throw new Error('Somehow called')
}

function getNumbers (list) {
  return Rx.Observable.of.apply(null, list)
    .filter(isNumber)
    .map(double)
}

module.exports = {getNumbers}

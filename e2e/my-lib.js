function add(a, b) {
  return a + b
}

function abs(x) {
  return x < 0 ? -x : x
}

function isEmail(s) {
  return /^\w+@\w+\.\w{3,4}$/.test(s)
}

module.exports = {add, abs, isEmail}

const la = require('lazy-ass')
const is = require('check-more-types')
const instrument = require('../src/instrument-source')
const {equals} = require('ramda')
const snapshot = require('snap-shot')
const {functionLabel} = require('../src/utils')
const {stripIndent} = require('common-tags')

/* global describe, it, beforeEach */
/* eslint-disable no-eval */
describe('function label', () => {
  it('is a function', () => {
    la(is.fn(functionLabel))
  })

  it('forms label from function name', () => {
    const label = functionLabel('add', 10)
    snapshot(label)
  })
})

describe('code instrument', () => {
  const source = stripIndent`
    function add(a, b) {
      return a + b
    }
    add(10, 2)
    add(20, 3)
    add(40, 2)
  `
  const filename = 'spec.js'
  let emitter

  beforeEach(() => {
    emitter = global.instrument
    delete global.__instrumenter
  })

  it('finds the add function', () => {
    const funcs = []
    emitter.on('function', c => funcs.push(c.name))
    instrument(source, filename)
    la(equals(['add'], funcs), funcs)
  })

  it('finds params', () => {
    const params = []
    emitter.on('function', c => params.push(c.params))
    instrument(source, filename)
    const expected = [['a', 'b']]
    la(equals(expected, params), params)
  })

  it('instruments', () => {
    snapshot(instrument(source, filename))
  })

  it('runs original code', () => {
    const result = eval(source)
    la(result === 42, 'evaluated source returns', result)
  })

  it('runs instrumented code', () => {
    const instrumented = instrument(source, filename)
    const result = eval(instrumented)
    la(result === 42, 'evaluated instrumented source returns', result)
  })

  it('fills values when running instrumented code', () => {
    const instrumented = instrument(source, filename)
    eval(instrumented)
    snapshot(global.__instrumenter)
  })

  it('has all values for param a', () => {
    const instrumented = instrument(source, filename)
    eval(instrumented)
    const label = functionLabel('add', 0)
    const addParams = global.__instrumenter.files[filename].functions[label]
    snapshot(addParams)

    la(is.array(addParams.a), 'has values for param "a"', addParams)
    snapshot(addParams.a)

    la(is.array(addParams.b), 'has values for param "b"', addParams)
    snapshot(addParams.b)
  })
})

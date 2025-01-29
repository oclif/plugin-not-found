import {expect} from 'chai'

import utils from '../src/utils.js'

describe('closest', () => {
  const possibilities = ['abc', 'def', 'ghi', 'jkl', 'jlk']

  it('exact match', () => {
    expect(utils.closest('abc', possibilities)).to.equal('abc')
  })

  it('case mistake', () => {
    expect(utils.closest('aBc', possibilities)).to.equal('abc')
  })

  it('case match one letter', () => {
    expect(utils.closest('aZZ', possibilities)).to.equal('abc')
  })

  it('one letter different mistake', () => {
    expect(utils.closest('ggi', possibilities)).to.equal('ghi')
  })

  it('two letter different mistake', () => {
    expect(utils.closest('gki', possibilities)).to.equal('ghi')
  })

  it('extra letter', () => {
    expect(utils.closest('gkui', possibilities)).to.equal('ghi')
  })

  it('two letter different mistake with close neighbor', () => {
    expect(utils.closest('jpp', possibilities)).to.equal('jkl')
  })

  it('no possibilities gives empty string', () => {
    expect(utils.closest('jpp', [])).to.equal('')
  })
})

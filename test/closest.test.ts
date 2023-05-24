import {closest} from '../src'
import {expect} from 'chai'

describe('closest', () => {
  const possibilities = ['abc', 'def', 'ghi', 'jkl', 'jlk']
  it('exact match', () => {
    expect(closest('abc', possibilities)).to.equal('abc')
  })

  it('case mistake', () => {
    expect(closest('aBc', possibilities)).to.equal('abc')
  })

  it('case match one letter', () => {
    expect(closest('aZZ', possibilities)).to.equal('abc')
  })

  it('one letter different mistake', () => {
    expect(closest('ggi', possibilities)).to.equal('ghi')
  })

  it('two letter different mistake', () => {
    expect(closest('gki', possibilities)).to.equal('ghi')
  })

  it('extra letter', () => {
    expect(closest('gkui', possibilities)).to.equal('ghi')
  })

  it('two letter different mistake with close neighbor', () => {
    expect(closest('jpp', possibilities)).to.equal('jkl')
  })

  it('no possibilities gives empty string', () => {
    expect(closest('jpp', [])).to.equal('')
  })
})

import {expect} from 'chai'
import {stripVTControlCharacters} from 'node:util'
import shelljs from 'shelljs'

describe('sf CLI integration', () => {
  before(() => {
    const build = shelljs.exec('yarn build')
    if (build.code !== 0) throw new Error('yarn build failed')

    const link = shelljs.exec('sf plugins link --no-install')
    if (link.code !== 0) throw new Error('sf plugins link failed')
  })

  after(() => {
    const unlink = shelljs.exec('sf plugins unlink .')
    if (unlink.code !== 0) throw new Error('sf plugins unlink failed')
  })

  it('should skip the prompt when not attached to a TTY and return 127', async () => {
    const isTTYval: boolean | undefined = process.stdin.isTTY

    if (isTTYval === true) {
      process.stdin.isTTY = false
    }

    const startTime = Date.now()
    const res = shelljs.exec('sf wat')
    const endTime = Date.now()

    expect(endTime - startTime).to.be.lessThan(3000)
    expect(stripVTControlCharacters(res.stdout)).to.not.include('Did you mean')
    expect(res.code).to.equal(127)

    process.stdin.isTTY = isTTYval
  })
})

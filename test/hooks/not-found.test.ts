import {runHook} from '@oclif/test'
import {expect} from 'chai'
import sinon from 'sinon'

import utils from '../../src/utils.js'

describe('command_not_found', () => {
  const isTTYval = process.stdin.isTTY

  beforeEach(() => {
    // stub if isTTY isn't undefined, otherwise set it to true (process.stdiin.isTTY is `undefined` in CI so mocha fails to stub it)
    if (process.stdin.isTTY) {
      sinon.stub(process.stdin, 'isTTY').value(true)
    } else {
      process.stdin.isTTY = true
    }
  })

  afterEach(() => {
    sinon.restore()
  })

  after(() => {
    // restore original isTTY value after all tests are done
    process.stdin.isTTY = isTTYval
  })

  it('should run hook with suggested command on yes', async () => {
    sinon.stub(utils, 'getConfirmation').resolves(true)
    sinon.stub(process, 'argv').returns([])

    const {stderr, stdout} = await runHook('command_not_found', {id: 'commans'})
    expect(stderr).to.contain('Warning: commans is not a @oclif/plugin-not-found command.\n')
    expect(stdout).to.match(/commands.+?\n.*?help/)
  })

  it('should run hook with suggested command on yes with varargs passed', async () => {
    sinon.stub(utils, 'getConfirmation').resolves(true)
    sinon.stub(process, 'argv').returns(['username'])

    const {stderr, stdout} = await runHook('command_not_found', {id: 'commans get'})
    expect(stderr).to.contain('Warning: commans get is not a @oclif/plugin-not-found command.\n')
    expect(stdout).to.match(/commands.+?\n.*?help/)
  })

  it('should run hook with suggested command and provided args on yes', async () => {
    sinon.stub(utils, 'getConfirmation').resolves(true)

    const {error, stderr} = await runHook('command_not_found', {argv: ['foo', '--bar', 'baz'], id: 'commans'})

    expect(stderr).to.contain('Warning: commans is not a @oclif/plugin-not-found command.\n')
    expect(error?.message).to.include('Nonexistent flag: --bar')
  })

  it('should run hook with not found error on no', async () => {
    sinon.stub(utils, 'getConfirmation').resolves(false)

    const {error, stderr} = await runHook('command_not_found', {id: 'commans'})
    expect(stderr).to.contain('Warning: commans is not a @oclif/plugin-not-found command.\n')
    expect(error?.message).to.contain('Run @oclif/plugin-not-found help for a list of available commands.')
  })
})

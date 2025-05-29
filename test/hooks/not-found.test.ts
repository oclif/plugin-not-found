import {runHook} from '@oclif/test'
import {expect} from 'chai'
import sinon from 'sinon'

import utils from '../../src/utils.js'

describe('command_not_found', () => {
  afterEach(() => {
    sinon.restore()
  })

  it('should not prompt if not attached to a TTY', async () => {
    sinon.stub(process, 'argv').returns([])
    sinon.stub(process.stdin, 'isTTY').set(() => false)

    const startTime = Date.now()
    const {error, stderr} = await runHook('command_not_found', {id: 'commans'})
    const endTime = Date.now()

    // the prompt times out after 10s, this assertion ensures the prompt never got rendered and the hook failed quickly
    expect(endTime - startTime).to.be.lessThan(3000)
    expect(stderr).to.contain('Warning: commans is not a @oclif/plugin-not-found command.\n')
    expect(error?.message).to.contain('Run @oclif/plugin-not-found help for a list of available commands.')
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

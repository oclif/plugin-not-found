import {runHook} from '@oclif/test'
import {expect} from 'chai'
import {SinonSandbox, createSandbox} from 'sinon'

import utils from '../../src/utils.js'

describe('command_not_found', () => {
  let sandbox: SinonSandbox

  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should run hook with suggested command on yes', async () => {
    sandbox.stub(utils, 'getConfirmation').resolves(true)
    sandbox.stub(process, 'argv').returns([])

    const {stderr, stdout} = await runHook('command_not_found', {id: 'commans'})
    expect(stderr).to.contain('Warning: commans is not a @oclif/plugin-not-found command.\n')
    expect(stdout).to.match(/commands.+?\n.*?help/)
  })

  it('should run hook with suggested command on yes with varargs passed', async () => {
    sandbox.stub(utils, 'getConfirmation').resolves(true)
    sandbox.stub(process, 'argv').returns(['username'])

    const {stderr, stdout} = await runHook('command_not_found', {id: 'commans get'})
    expect(stderr).to.contain('Warning: commans get is not a @oclif/plugin-not-found command.\n')
    expect(stdout).to.match(/commands.+?\n.*?help/)
  })

  it('should run hook with suggested command and provided args on yes', async () => {
    sandbox.stub(utils, 'getConfirmation').resolves(true)

    const {error, stderr} = await runHook('command_not_found', {argv: ['foo', '--bar', 'baz'], id: 'commans'})

    expect(stderr).to.contain('Warning: commans is not a @oclif/plugin-not-found command.\n')
    expect(error?.message).to.include('Nonexistent flag: --bar')
  })

  it('should run hook with not found error on no', async () => {
    sandbox.stub(utils, 'getConfirmation').resolves(false)

    const {error, stderr} = await runHook('command_not_found', {id: 'commans'})
    expect(stderr).to.contain('Warning: commans is not a @oclif/plugin-not-found command.\n')
    expect(error?.message).to.contain('Run @oclif/plugin-not-found help for a list of available commands.')
  })
})

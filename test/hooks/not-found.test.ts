import * as chalk from 'chalk'
import {expect, test} from '@oclif/test'
import {cli} from 'cli-ux'

Object.assign(chalk, {level: 0})

describe('command_not_found', () => {
  let oldArgv: string[]
  beforeEach(() => {
    oldArgv = process.argv
  })
  afterEach(() => {
    process.argv = oldArgv
  })
  test
  .stub(cli, 'prompt', () => async () => 'y')
  .stdout()
  .stderr()
  .do(() => {
    process.argv = []
  })
  .hook('command_not_found', {id: 'commans'})
  .catch('EEXIT: 0')
  .end('runs hook with suggested command on yes', (ctx: any) => {
    expect(ctx.stderr).to.be.contain('Warning: commans is not a @oclif/plugin-not-found command.\n')
    expect(ctx.stdout).to.be.contain('commands\nhelp')
  })

  test
  .stderr()
  .stub(cli, 'prompt', () => async () => 'y')
  .do(() => {
    process.argv = []
  })
  .hook('command_not_found', {id: 'commans', argv: ['foo', '--bar', 'baz']})
  .catch('Unexpected arguments: foo, --bar, baz\nSee more help with --help')
  .end('runs hook with suggested command and provided args on yes', (ctx: any) => {
    expect(ctx.stderr).to.contain('Warning: commans is not a @oclif/plugin-not-found command.\n')
  })

  test
  .stderr()
  .stub(cli, 'prompt', () => async () => 'n')
  .hook('command_not_found', {id: 'commans'})
  .catch('Run @oclif/plugin-not-found help for a list of available commands.')
  .end('runs hook with not found error on no', (ctx: any) => {
    expect(ctx.stderr).to.be.contain('Warning: commans is not a @oclif/plugin-not-found command.\n')
  })

  test
  .stderr()
  .hook('command_not_found', {id: 'commans'})
  .catch('Run @oclif/plugin-not-found help for a list of available commands.')
  .end('runs hook with not found error after no input timeout', (ctx: any) => {
    expect(ctx.stderr).to.be.contain('Warning: commans is not a @oclif/plugin-not-found command.\n')
  })
})

import {ux} from '@oclif/core'
import {expect, test} from '@oclif/test'

describe('command_not_found', () => {
  test
    .stub(ux, 'prompt', (stub) => stub.returns('y'))
    .stub(process, 'argv', (stub) => stub.returns([]))
    .stdout()
    .stderr()
    .hook('command_not_found', {id: 'commans'})
    .end('runs hook with suggested command on yes', (ctx) => {
      expect(ctx.stderr).to.be.contain('Warning: commans is not a @oclif/plugin-not-found command.\n')
      expect(ctx.stdout).to.match(/commands.+?\n.*?help/)
    })

  test
    .stub(ux, 'prompt', (stub) => stub.returns('y'))
    .stub(process, 'argv', (stub) => stub.returns(['username']))
    .stdout()
    .stderr()
    .hook('command_not_found', {id: 'commans get'})
    .end('runs hook with suggested command on yes with varargs passed', (ctx) => {
      expect(ctx.stderr).to.be.contain('Warning: commans get is not a @oclif/plugin-not-found command.\n')
      expect(ctx.stdout).to.match(/commands.+?\n.*?help/)
    })

  test
    .stderr()
    .stub(ux, 'prompt', (stub) => stub.returns('y'))
    .hook('command_not_found', {argv: ['foo', '--bar', 'baz'], id: 'commans'})
    .catch((error: Error) => error.message.includes('Unexpected arguments: foo, --bar, baz\nSee more help with --help'))
    .end('runs hook with suggested command and provided args on yes', (ctx) => {
      expect(ctx.stderr).to.contain('Warning: commans is not a @oclif/plugin-not-found command.\n')
    })

  test
    .stderr()
    .stub(ux, 'prompt', (stub) => stub.returns('n'))
    .hook('command_not_found', {id: 'commans'})
    .catch((error: Error) =>
      error.message.includes('Run @oclif/plugin-not-found help for a list of available commands.'),
    )
    .end('runs hook with not found error on no', (ctx) => {
      expect(ctx.stderr).to.be.contain('Warning: commans is not a @oclif/plugin-not-found command.\n')
    })

  test
    .stderr()
    .hook('command_not_found', {id: 'commans'})
    .catch((error: Error) =>
      error.message.includes('Run @oclif/plugin-not-found help for a list of available commands.'),
    )
    .end('runs hook with not found error after no input timeout', (ctx) => {
      expect(ctx.stderr).to.be.contain('Warning: commans is not a @oclif/plugin-not-found command.\n')
    })
})

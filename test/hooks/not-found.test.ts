import chalk, {color} from '@oclif/color'
import {expect, test} from '@oclif/test'
import {cli} from 'cli-ux'

const yes = () => 'y'
const no = () => 'n'

color(chalk, 'enabled', 0)

describe('command_not_found', () => {
  test
  .stub(cli, 'prompt', () => yes)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  .stub(process, 'argv', [])
  .stdout()
  .stderr()
  .hook('command_not_found', {id: 'commans'})
  .catch('EEXIT: 0')
  .end('runs hook with suggested command on yes', (ctx: any) => {
    expect(ctx.stderr).to.be.contain('Warning: commans is not a @oclif/plugin-not-found command.\n')
    expect(ctx.stdout).to.match(/commands.+?\n.*?help/)
  })

  test
  .stderr()
  .stub(cli, 'prompt', yes)
  .hook('command_not_found', {id: 'commans', argv: ['foo', '--bar', 'baz']})
  .catch((error: Error) => error.message.includes('Unexpected arguments: foo, --bar, baz\nSee more help with --help'))
  .end('runs hook with suggested command and provided args on yes', (ctx: any) => {
    expect(ctx.stderr).to.contain('Warning: commans is not a @oclif/plugin-not-found command.\n')
  })

  test
  .stderr()
  .stub(cli, 'prompt', () => no)
  .hook('command_not_found', {id: 'commans'})
  .catch((error: Error) => error.message.includes('Run @oclif/plugin-not-found help for a list of available commands.'))
  .end('runs hook with not found error on no', (ctx: any) => {
    expect(ctx.stderr).to.be.contain('Warning: commans is not a @oclif/plugin-not-found command.\n')
  })

  test
  .stderr()
  .hook('command_not_found', {id: 'commans'})
  .catch((error: Error) => error.message.includes('Run @oclif/plugin-not-found help for a list of available commands.'))
  .end('runs hook with not found error after no input timeout', (ctx: any) => {
    expect(ctx.stderr).to.be.contain('Warning: commans is not a @oclif/plugin-not-found command.\n')
  })
})

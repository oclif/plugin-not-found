import chalk from '@heroku-cli/color'
import {test} from '@oclif/test'

chalk.enabled = false

describe('command', () => {
  test
  .hook('command_not_found', {id: 'hel'})
  .catch(`hel is not a @oclif/plugin-not-found command.
Perhaps you meant help
Run @oclif/plugin-not-found help for a list of available commands.`)
  .end('runs hook')
})

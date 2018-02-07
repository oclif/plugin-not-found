import {test} from '@anycli/test'
import chalk from '@heroku-cli/color'

chalk.enabled = false

describe('command', () => {
  test
  .hook('command_not_found', {id: 'hel'})
  .catch(`hel is not a @anycli/plugin-not-found command.
Perhaps you meant help
Run @anycli/plugin-not-found help for a list of available commands.`)
  .end('runs hook')
})

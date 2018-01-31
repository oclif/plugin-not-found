import {test} from '@anycli/test'
import color from '@heroku-cli/color'
import * as path from 'path'

color.enabled = false

const root = path.join(__dirname, '../fixtures/test')

describe('command', () => {
  test
  .loadConfig({root})
  .hook('command_not_found', {id: 'hel'})
  .catch(`hel is not a mycli command.
    Perhaps you meant hello
Run mycli help for a list of available commands.`)
  .end('runs hook')
})

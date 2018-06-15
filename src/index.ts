import {color} from '@heroku-cli/color'
import {Hook} from '@oclif/config'
import {cli} from 'cli-ux'
import * as Levenshtein from 'fast-levenshtein'
import * as _ from 'lodash'

const hook: Hook<'command_not_found'> = async function (opts) {
  const commandIDs = opts.config.commandIDs
  if (!commandIDs.length) return
  function closest(cmd: string) {
    return _.minBy(commandIDs, c => Levenshtein.get(cmd, c))!
  }

  let binHelp = `${opts.config.bin} help`
  let idSplit = opts.id.split(':')
  if (await opts.config.findTopic(idSplit[0])) {
    // if valid topic, update binHelp with topic
    binHelp = `${binHelp} ${idSplit[0]}`
  }

  let suggestion: string = closest(opts.id)
  this.warn(`${color.yellow(opts.id)} is not a ${opts.config.bin} command.`)

  let response
  try {
    response = await cli.prompt(`Did you mean ${color.blueBright(suggestion)}? [y/n]`, {timeout: 4900})
  } catch (err) {
    this.log('')
    this.debug(err)
  }

  if (response === 'y') {
      const argv = process.argv
      await this.config.runCommand(suggestion, argv.slice(3, argv.length))
      this.exit(0)
  }

  this.error(`Run ${color.cmd(binHelp)} for a list of available commands.`, {exit: 127})
}

export default hook

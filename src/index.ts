import {color} from '@oclif/color'
import {Hook, toConfiguredId} from '@oclif/core'
import {cli} from 'cli-ux'
import * as Levenshtein from 'fast-levenshtein'
import * as _ from 'lodash'

const hook: Hook.CommandNotFound = async function (opts) {
  const hiddenCommandIds = opts.config.commands.filter(c => c.hidden).map(c => c.id)
  const commandIDs = [
    ...opts.config.commandIDs,
    ..._.flatten(opts.config.commands.map(c => c.aliases)),
    'version',
  ].filter(c => !hiddenCommandIds.includes(c))

  if (commandIDs.length === 0) return
  function closest(cmd: string): string {
    return _.minBy(commandIDs, c => Levenshtein.get(cmd, c))!
  }

  let binHelp = `${opts.config.bin} help`
  const idSplit = opts.id.split(':')
  if (opts.config.findTopic(idSplit[0])) {
    // if valid topic, update binHelp with topic
    binHelp = `${binHelp} ${idSplit[0]}`
  }

  const suggestion = closest(opts.id)
  const readableSuggestion = toConfiguredId(suggestion, this.config)
  const originalCmd = toConfiguredId(opts.id, this.config)
  this.warn(`${color.yellow(originalCmd)} is not a ${opts.config.bin} command.`)

  let response = ''
  try {
    response = await cli.prompt(`Did you mean ${color.blueBright(readableSuggestion)}? [y/n]`, {timeout: 4900})
  } catch (error) {
    this.log('')
    this.debug(error)
  }

  if (response === 'y') {
    const argv = opts.argv || process.argv.slice(3, process.argv.length)
    await this.config.runCommand(suggestion, argv)
    this.exit(0)
  }

  this.error(`Run ${color.cmd(binHelp)} for a list of available commands.`, {exit: 127})
}

export default hook

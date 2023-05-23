import {color} from '@oclif/color'
import {ux, Hook, toConfiguredId} from '@oclif/core'
import * as Levenshtein from 'fast-levenshtein'
import * as _ from 'lodash'

const hook: Hook.CommandNotFound = async function (opts) {
  const hiddenCommandIds = new Set(opts.config.commands.filter(c => c.hidden).map(c => c.id))
  const commandIDs = [
    ...opts.config.commandIDs,
    ...opts.config.commands.flatMap(c => c.aliases),
  ].filter(c => !hiddenCommandIds.has(c))

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
    response = await ux.prompt(`Did you mean ${color.blueBright(readableSuggestion)}? [y/n]`, {timeout: 10_000})
  } catch (error) {
    this.log('')
    this.debug(error)
  }

  if (response === 'y') {
    // this will split the original command from the suggested replacement, and gather the remaining args as varargs to help with situations like:
    // confit set foo-bar -> confit:set:foo-bar -> config:set:foo-bar -> config:set foo-bar
    const argv = opts.argv?.length ? opts.argv : opts.id.split(':').slice(suggestion.split(':').length)
    return this.config.runCommand(suggestion, argv)
  }

  this.error(`Run ${color.cmd(binHelp)} for a list of available commands.`, {exit: 127})
}

export default hook

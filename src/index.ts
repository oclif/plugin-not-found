import {Hook} from '@anycli/config'
import {color} from '@heroku-cli/color'

const hook: Hook<'command_not_found'> = async function (opts) {
  const commandIDs = opts.config.commandIDs
  if (!commandIDs.length) return
  function closest(cmd: string) {
    const DCE = require('string-similarity')
    return DCE.findBestMatch(cmd, commandIDs).bestMatch.target
  }

  let binHelp = `${opts.config.bin} help`
  let idSplit = opts.id.split(':')
  if (await opts.config.findTopic(idSplit[0])) {
    // if valid topic, update binHelp with topic
    binHelp = `${binHelp} ${idSplit[0]}`
    // if topic:COMMAND present, try closest for id
    // if (idSplit[1]) closest = this.closest(id)
  }

  let perhaps = closest ? `Perhaps you meant ${color.yellow(closest(opts.id))}\n` : ''
  this.error(
    `${color.yellow(opts.id)} is not a ${opts.config.bin} command.
    ${perhaps}Run ${color.cmd(binHelp)} for a list of available commands.`,
    {exit: 127},
  )
}

export default hook

import {Hooks, IHook} from '@dxcli/config'
import {color} from '@heroku-cli/color'
import cli from 'cli-ux'

const hook: IHook<Hooks['command_not_found']> = async opts => {
  function closest(cmd: string) {
    const DCE = require('string-similarity')
    return DCE.findBestMatch(cmd, opts.config.engine.commandIDs).bestMatch.target
  }

  let binHelp = `${opts.config.bin} help`
  let idSplit = opts.id.split(':')
  if (await opts.config.engine.findTopic(idSplit[0])) {
    // if valid topic, update binHelp with topic
    binHelp = `${binHelp} ${idSplit[0]}`
    // if topic:COMMAND present, try closest for id
    // if (idSplit[1]) closest = this.closest(id)
  }

  let perhaps = closest ? `Perhaps you meant ${color.yellow(closest(opts.id))}\n` : ''
  cli.error(
    `${color.yellow(opts.id)} is not a ${opts.config.bin} command.
    ${perhaps}Run ${color.cmd(binHelp)} for a list of available commands.`,
    {exit: 127},
  )
}

export default hook

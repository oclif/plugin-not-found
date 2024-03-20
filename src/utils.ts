import confirm from '@inquirer/confirm'
import chalk from 'chalk'
import {default as levenshtein} from 'fast-levenshtein'
import {setTimeout} from 'node:timers/promises'

const getConfirmation = async (suggestion: string): Promise<boolean> => {
  const ac = new AbortController()
  const {signal} = ac
  const confirmation = confirm({
    default: true,
    message: `Did you mean ${chalk.blueBright(suggestion)}?`,
    theme: {
      prefix: '',
      style: {
        message: (text: string) => chalk.reset(text),
      },
    },
  })

  setTimeout(10_000, {signal})
    .catch(() => false)
    .then(() => confirmation.cancel())

  return confirmation.then((value) => {
    ac.abort()
    return value
  })
}

const closest = (target: string, possibilities: string[]): string =>
  possibilities
    .map((id) => ({distance: levenshtein.get(target, id, {useCollator: true}), id}))
    .sort((a, b) => a.distance - b.distance)[0]?.id ?? ''

export default {
  closest,
  getConfirmation,
}

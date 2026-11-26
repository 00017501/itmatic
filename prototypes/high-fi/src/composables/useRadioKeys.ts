/**
 * Keyboard behaviour of a radio group: the arrow keys move the choice from the focused option,
 * and only the chosen option is a Tab stop. Bind to keydown on the element with role="radiogroup".
 */
export function moveRadioChoice<T>(
  event: KeyboardEvent,
  options: T[],
  choose: (value: T) => void,
): void {
  const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown'
  const back = event.key === 'ArrowLeft' || event.key === 'ArrowUp'
  const group = event.currentTarget
  if ((!forward && !back) || !(group instanceof HTMLElement)) return
  event.preventDefault()
  // The options are drawn in the same order as `options`, so positions match.
  const radios = [...group.querySelectorAll<HTMLElement>('[role="radio"]')]
  const from = radios.findIndex((radio) => radio === event.target)
  const to = (from + (forward ? 1 : -1) + options.length) % options.length
  const next = options[to]
  if (next === undefined) return
  choose(next)
  // Focus follows the choice, as in a native radio group.
  radios[to]?.focus()
}

/** The chosen option is the Tab stop; with nothing chosen, the first one is. */
export function radioTabIndex<T>(option: T, index: number, current: T | null): 0 | -1 {
  return current === option || (current === null && index === 0) ? 0 : -1
}

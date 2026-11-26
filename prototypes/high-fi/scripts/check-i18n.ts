// Checks that ru.ts and uz.ts have exactly the keys of en.ts and keep every {placeholder}.
// Run: node scripts/check-i18n.ts
import en from '../src/i18n/en.ts'
import ru from '../src/i18n/ru.ts'
import uz from '../src/i18n/uz.ts'

type Tree = { [key: string]: string | Tree }

function flatten(tree: Tree, prefix = ''): Map<string, string> {
  const out = new Map<string, string>()
  for (const [key, value] of Object.entries(tree)) {
    if (typeof value === 'string') out.set(prefix + key, value)
    else for (const [k, v] of flatten(value, `${prefix}${key}.`)) out.set(k, v)
  }
  return out
}

const placeholders = (text: string): string => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',')
const source = flatten(en as Tree)
let failed = 0
for (const [name, tree] of [['ru', ru], ['uz', uz]] as const) {
  const target = flatten(tree as Tree)
  const missing = [...source.keys()].filter((k) => !target.has(k))
  const extra = [...target.keys()].filter((k) => !source.has(k))
  const broken = [...source.keys()].filter((k) => target.has(k) && placeholders(source.get(k) ?? '') !== placeholders(target.get(k) ?? ''))
  const same = [...source.keys()].filter((k) => target.get(k) === source.get(k)).length
  console.log(`${name}: ${target.size} of ${source.size} keys; missing ${missing.length}, extra ${extra.length}, placeholder mismatches ${broken.length}, identical to English ${same}`)
  for (const k of [...missing.slice(0, 8), ...extra.slice(0, 8), ...broken.slice(0, 8)]) console.log(`  ${k}`)
  if (missing.length || extra.length || broken.length) failed++
}
process.exit(failed ? 1 : 0)

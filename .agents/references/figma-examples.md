# Figma examples

Worked snippets for [`figma.md`](../rules/figma.md) and [`project/lowfi.md`](../rules/project/lowfi.md). They follow the `$fig` builder described in the Figma MCP's `figma-use` skill. That skill is the authority on the API: in Claude Code load it before running any of these, and check names there if a call fails.

Each block is one `use_figma` call. Return the ids you will need in a later call.

## 1. Greyscale variables and text styles (once, first)

```js
const greys = $fig.varCollection({ name: 'Low-fi greys', modes: ['Default'] })
const v = {
  paper: greys.colorVar({ name: 'paper', values: { Default: '#FFFFFF' } }),
  mist: greys.colorVar({ name: 'mist', values: { Default: '#F5F7F8' } }),
  line: greys.colorVar({ name: 'line', values: { Default: '#D5DCE1' } }),
  lineStrong: greys.colorVar({ name: 'line-strong', values: { Default: '#7A8792' } }),
  inkMuted: greys.colorVar({ name: 'ink-muted', values: { Default: '#52606B' } }),
  ink: greys.colorVar({ name: 'ink', values: { Default: '#14202A' } }),
}
// Text styles named after DESIGN.md typography tokens.
$fig.textStyle({ name: 'page-title', fontName: { family: 'Onest', style: 'SemiBold' }, fontSize: 28 })
$fig.textStyle({ name: 'section-title', fontName: { family: 'Onest', style: 'SemiBold' }, fontSize: 20 })
$fig.textStyle({ name: 'body', fontName: { family: 'Onest', style: 'Regular' }, fontSize: 16 })
$fig.textStyle({ name: 'body-compact', fontName: { family: 'Onest', style: 'Regular' }, fontSize: 14 })
$fig.textStyle({ name: 'label', fontName: { family: 'Onest', style: 'SemiBold' }, fontSize: 14 })
$fig.textStyle({ name: 'caption', fontName: { family: 'Onest', style: 'Regular' }, fontSize: 12 })
```

If Onest is not available in the file, stop and say so; do not silently fall back to another font.

## 2. A component with variants (on the Components page)

```js
const TYPES = ['Primary', 'Secondary']
const SIZES = ['Desktop', 'Phone'] // 40 px and 48 px high, from DESIGN.md
const button = $fig.variants({ name: 'Button' },
  TYPES.flatMap((type) => SIZES.map((size) =>
    $fig.component({
      name: `Type=${type}, Size=${size}`,
      layoutMode: 'HORIZONTAL', primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER',
      paddingLeft: 16, paddingRight: 16, height: size === 'Phone' ? 48 : 40, cornerRadius: 6,
      // Primary is filled ink in the low-fi (no brand colour); Secondary is outlined.
    }, [$fig.text({ characters: 'Save lesson', textStyle: $fig.getStyle('label') }).textProp('Label')]),
  )),
)
await $fig.done()
// Variants stack at (0,0): grid them and resize the set, as fig-builder.md shows.
return { buttonSetId: button.node.id }
```

Build the rest of the minimum set the same way: Input, Select, Checkbox, Table row, List row, Page header, Sidebar, Bottom navigation, Badge, Dialog, Stepper, Toast, Banner.

## 3. A phone screen from instances

```js
const BUTTON_SET = '<buttonSetId from step 2>'
const screen = $fig.autoLayout({
  name: 'S07 Lesson record form', layoutMode: 'VERTICAL', width: 360, height: 800,
  paddingLeft: 16, paddingRight: 16, paddingTop: 16, paddingBottom: 16, itemSpacing: 16,
}, [
  $fig.text({ name: 'Title', characters: 'English B1, 09:00', textStyle: $fig.getStyle('page-title') }),
  // ... list rows as instances of the List row component, one per seed student
  $fig.instance(BUTTON_SET, { name: 'tap/Save lesson', layoutSizingHorizontal: 'FILL',
    props: { Type: 'Primary', Size: 'Phone', Label: 'Save lesson' } }),
])
await $fig.done()
return { s07: screen.node.id }
```

## 4. Links between screens

Reactions are set on the real nodes after the plan is flushed.

```js
const LINKS = [
  // [source layer id, destination frame id, 'NAVIGATE' | 'OVERLAY']
  ['<tap/Save lesson id>', '<S06 frame id>', 'NAVIGATE'],
  ['<tap/Report absence id>', '<S10a frame id>', 'OVERLAY'],
]
for (const [sourceId, destinationId, navigation] of LINKS) {
  const node = await figma.getNodeByIdAsync(sourceId)
  await node.setReactionsAsync([{
    trigger: { type: 'ON_CLICK' },
    actions: [{ type: 'NODE', destinationId, navigation,
      transition: { type: 'DISSOLVE', easing: { type: 'EASE_OUT' }, duration: 0.2 } }],
  }])
}
// Overlays need a way out: a tap/Close layer with { type: 'CLOSE' }.
const page = figma.currentPage
page.flowStartingPoints = [{ nodeId: '<S01 frame id>', name: 'ITmatic prototype' }]
return { linked: LINKS.length }
```

## 5. Link-graph check (read only)

```js
const frames = figma.currentPage.findChildren((n) => n.type === 'FRAME' || n.type === 'SECTION')
  .flatMap((n) => (n.type === 'SECTION' ? n.children.filter((c) => c.type === 'FRAME') : [n]))
const byId = Object.fromEntries(frames.map((f) => [f.id, f]))
const edges = {}, unlinked = [], closes = new Set()
for (const f of frames) {
  edges[f.id] = new Set()
  for (const n of f.findAll((x) => x.name.startsWith('tap/'))) {
    const actions = (n.reactions || []).flatMap((r) => r.actions || [])
    if (!actions.length) unlinked.push(`${f.name} > ${n.name}`)
    for (const a of actions) {
      if (a.type === 'NODE' && byId[a.destinationId]) edges[f.id].add(a.destinationId)
      if (a.type === 'BACK' || a.type === 'CLOSE') closes.add(f.id)
    }
  }
}
const start = frames.find((f) => f.name.startsWith('S01'))
const seen = new Set([start.id]), queue = [start.id]
while (queue.length) for (const d of edges[queue.shift()]) if (!seen.has(d)) { seen.add(d); queue.push(d) }
return {
  frames: frames.map((f) => f.name),
  unreachable: frames.filter((f) => !seen.has(f.id)).map((f) => f.name),
  deadEnds: frames.filter((f) => edges[f.id].size === 0 && !closes.has(f.id)).map((f) => f.name),
  unlinked,
}
```

All of `unreachable`, `deadEnds` and `unlinked` must be empty. Compare `frames` with the screens contract.

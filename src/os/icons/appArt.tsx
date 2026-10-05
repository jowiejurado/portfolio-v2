import type { AppId } from '@/store/types'

/*
 * Space-themed pixel sprites (boot rocket, cursor, click rocket, lanyard art)
 * in the chunky 90s desktop style — app icons live in minimal.tsx. Each is a
 * small fill grid; the ink outline and the 1px drop shadow are computed
 * from its silhouette so every icon shares the same edge.
 *
 * Palette (our own — warm desktop, built to sit beside the Ubuntu accent):
 */
export const PALETTE: Record<string, string> = {
  w: '#fdf3e1', // paper / suit white
  s: '#e9cfa0', // sand
  o: '#f28c38', // orange
  r: '#d9483b', // tomato
  y: '#ffd25e', // butter / starlight
  m: '#63c7a1', // mint (alien, radar)
  t: '#2f8f86', // teal
  T: '#226a63', // deep teal
  b: '#7cc0ea', // sky
  B: '#4f8fbf', // deep sky
  n: '#2b4570', // navy (space)
  p: '#5a3f94', // planet purple
  v: '#8d6ad8', // violet
  l: '#c3aef0', // lilac highlight
  g: '#cfc8db', // lavender metal
  G: '#958ca8', // metal shade
  k: '#231a2e', // ink
}
export const SHADOW = 'rgb(20 10 30 / 0.45)'

/** Fill grids, space edition. '.' is empty; any other key is a palette colour. */
export const GRIDS: Record<AppId, string[]> = {
  // ringed planet: a whole new world to explore
  welcome: [
    '....ppppp....',
    '..ppvvvvvpp..',
    '.pvvlvvvvvvp.',
    '.pvlvvvvvvvp.',
    'ooooooooooooo',
    'yyyyyyyyyyyyy',
    '.pvvvvvvvvPp.',
    '.pvvvvvvvPPp.',
    '..ppvvvPPpp..',
    '....ppppp....',
  ],
  // astronaut helmet: the person inside the suit
  about: [
    '....wwwww....',
    '..wwwwwwwww..',
    '.wwnnnnnnnww.',
    '.wnnbnnnnnnw.',
    'wwnbnnnnnnnww',
    'wwnnnnnnnnoww',
    'wwnnnnnnnnnww',
    '.wwnnnnnnnww.',
    '.wwwwwwwwwww.',
    '..sswwwwwss..',
    '.ssssrrrssss.',
    '.sssssssssss.',
  ],
  // rocket: things that launched
  projects: [
    '......r......',
    '.....rrr.....',
    '....wwwww....',
    '....wwwww....',
    '....wbbbw....',
    '....wbnbw....',
    '....wbbbw....',
    '....wwwws....',
    '...owwwwso...',
    '..oowwwwsoo..',
    '..oo.yry.oo..',
    '.....yry.....',
    '......y......',
  ],
  // satellite: long missions in orbit
  experience: [
    '......g......',
    '......g......',
    'bBbB.yyy.bBbB',
    'BbBbgyyygBbBb',
    'bBbB.yoy.bBbB',
    'BbBb.yyy.BbBb',
    '.....ggg.....',
    '....g...g....',
  ],
  // telescope: looking at the stats
  github: [
    '.y........ww.',
    '........wwnnw',
    '......wwnnnw.',
    '....wwnnnw...',
    '..ssnnnw.....',
    '.ssnnw.......',
    '..s..ggg.....',
    '.....g.g.....',
    '....g...g....',
    '...g.....g...',
    '..g.......g..',
  ],
  // space invader
  games: [
    '...m.....m...',
    '....m...m....',
    '...mmmmmmm...',
    '..mmkmmmkmm..',
    '.mmmmmmmmmmm.',
    '.m.mmmmmmm.m.',
    '.m.m.....m.m.',
    '....mm.mm....',
  ],
  // space mail: envelope with a planet stamp
  contact: [
    'sssssssssssss',
    'wsssssssssssw',
    'wwsssssssssww',
    'wwwssssssswww',
    'wwwwssssswwww',
    'wwwwwrrrwwwww',
    'wwwwwwwwwvvvw',
    'wwwwwwwwyyyyw',
    'wwwwwwwwwvvvw',
    'sssssssssssss',
  ],
  // cargo container with a star stencil
  files: [
    'ggggggggggggg',
    'gykkyykkyykkg',
    'ggggggggggggg',
    'gtttttttttttg',
    'gttttwwwttttg',
    'gtttwwwwwtttg',
    'gttttwwwttttg',
    'gtttwtttwtttg',
    'gTTTTTTTTTTTg',
    'ggggggggggggg',
  ],
  // mission control: radar sweep with a blip
  terminal: [
    'sssssssssssss',
    'snnnnnnnnnnns',
    'snnnnmmmnnnns',
    'snnnmnnnnmnns',
    'snnmnnmnnnmns',
    'snnmnnmmmnmns',
    'snnnmnnnnmnns',
    'snnnnmmmnnyns',
    'sssssssssssss',
    '.....sss.....',
    '...sssssss...',
  ],
  // gear with a tiny moon in orbit
  settings: [
    '.....ggg....y',
    '.gg..ggg..gg.',
    '.ggggggggggg.',
    '..ggggggggg..',
    '..gggGGGggg..',
    'gggggG.Gggggg',
    'ggggG...Ggggg',
    'gggggG.GggggG',
    '..gggGGGgggG.',
    '..gggggggggG.',
    '.gggggggggGG.',
    '.gg..ggg..GG.',
    'l....GGG.....',
  ],
}

export const SIZE = 16 // every icon renders on a 16×16 pixel grid

/** Grid → per-colour SVG paths (outline + shadow computed). */
export function build(grid: string[], at?: { x: number; y: number }) {
  const h = grid.length
  const w = grid[0].length
  // centre the art (+1 outline on each side, +1 shadow right/bottom)
  const ox = at ? at.x : Math.floor((SIZE - (w + 3)) / 2) + 1
  const oy = at ? at.y : Math.floor((SIZE - (h + 3)) / 2) + 1
  const cells = new Map<string, string>()
  const key = (x: number, y: number) => `${x},${y}`
  grid.forEach((row, y) =>
    [...row].forEach((c, x) => {
      if (c !== '.') cells.set(key(x + ox, y + oy), c)
    }),
  )
  // ink outline around the silhouette (and around enclosed holes)
  const filled = new Set(cells.keys())
  for (const k of filled) {
    const [x, y] = k.split(',').map(Number)
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const n = key(x + dx, y + dy)
      if (!cells.has(n)) cells.set(n, 'k')
    }
  }
  // hard drop shadow, one pixel down-right
  const shadow: string[] = []
  for (const k of cells.keys()) {
    const [x, y] = k.split(',').map(Number)
    if (!cells.has(key(x + 1, y + 1))) shadow.push(key(x + 1, y + 1))
  }
  const toPath = (keys: Iterable<string>) => {
    let d = ''
    for (const k of keys) {
      const [x, y] = k.split(',')
      d += `M${x} ${y}h1v1h-1z`
    }
    return d
  }
  const byColour = new Map<string, string[]>()
  for (const [k, c] of cells) {
    const list = byColour.get(c) ?? []
    list.push(k)
    byColour.set(c, list)
  }
  return {
    shadow: toPath(shadow),
    layers: [...byColour].map(([c, keys]) => ({ fill: PALETTE[c], d: toPath(keys) })),
  }
}

/** Standalone SVG markup for a pixel grid (used for the CSS cursor). */
export function pixelSvgString(grid: string[], px: number, at = { x: 1, y: 1 }) {
  const art = build(grid, at)
  const paths = [`<path d="${art.shadow}" fill="${SHADOW}"/>`, ...art.layers.map((l) => `<path d="${l.d}" fill="${l.fill}"/>`)]
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 ${SIZE} ${SIZE}" shape-rendering="crispEdges">${paths.join('')}</svg>`
}

/** A free-standing pixel sprite from GRIDS (boot rocket). */
export function PixelSprite({ grid, className }: { grid: string[]; className?: string }) {
  const art = build(grid)
  return (
    <svg aria-hidden viewBox={`0 0 ${SIZE} ${SIZE}`} shapeRendering="crispEdges" className={className}>
      <path d={art.shadow} fill={SHADOW} />
      {art.layers.map((l) => (
        <path key={l.fill} d={l.d} fill={l.fill} />
      ))}
    </svg>
  )
}

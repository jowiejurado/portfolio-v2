/* Covers are drawn from each game's own screen, not stock art. */

/** Renders the '#' cells of a pixel map as 1-unit rects. */
function Pixels({ rows, x = 0, y = 0, fill }: { rows: string[]; x?: number; y?: number; fill: string }) {
  return (
    <g fill={fill}>
      {rows.flatMap((row, j) =>
        row.split('').map((c, i) => (c === '#' ? <rect key={`${i}-${j}`} x={x + i} y={y + j} width={1} height={1} /> : null)),
      )}
    </g>
  )
}

export function BounceCover() {
  const bricks: [number, number, number, number][] = [
    [0, 0, 160, 12], // ceiling
    [96, 12, 32, 16], // hanging block
    [8, 56, 56, 16], // left ledge
    [8, 72, 24, 32],
    [72, 56, 56, 16], // middle ledge
    [88, 72, 24, 16],
    [140, 56, 20, 16], // right ledge
    [0, 104, 160, 16], // floor
  ]
  return (
    <svg viewBox="0 0 160 120" className="block size-full" shapeRendering="crispEdges" aria-hidden>
      <defs>
        <pattern id="bounce-brick" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill="#d83a1c" />
          <rect width="16" height="1" fill="#f0743c" />
          <rect width="1" height="16" fill="#f0743c" />
          <rect y="15" width="16" height="1" fill="#7a1708" />
          <rect x="15" width="1" height="16" fill="#7a1708" />
          <rect x="3" y="4" width="3" height="2" fill="#f25a2a" />
          <rect x="9" y="9" width="4" height="2" fill="#a8250d" />
          <rect x="4" y="11" width="2" height="2" fill="#a8250d" />
        </pattern>
      </defs>
      <rect width="160" height="120" fill="#5fcdf5" />
      {bricks.map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill="url(#bounce-brick)" />
      ))}
      {/* thorns */}
      {[52, 132].map((x) => (
        <g key={x}>
          <path d={`M${x} 104 L${x + 2} 86 L${x + 4} 104 Z`} fill="#f2b705" />
          <path d={`M${x - 2} 94 H${x + 6} M${x - 2} 99 H${x + 6}`} stroke="#c22a10" strokeWidth="1.5" />
        </g>
      ))}
      <ellipse cx="114" cy="40" rx="4.5" ry="13" fill="none" stroke="#ffd60a" strokeWidth="2.5" shapeRendering="auto" />
      <g shapeRendering="auto">
        <circle cx="94" cy="45" r="10.5" fill="#d7262b" stroke="#7a0f12" strokeWidth="1" />
        <circle cx="90" cy="41" r="3.5" fill="#ff8a7a" opacity="0.8" />
      </g>
    </svg>
  )
}

export function SpaceImpactCover() {
  const heart = ['.#.#.', '#####', '#####', '.###.', '..#..']
  const zero = ['###', '#.#', '#.#', '#.#', '###']
  const four = ['#.#', '#.#', '###', '..#', '..#']
  const ship = ['##......', '.###....', '.######.', '..######', '.######.', '.###....', '##......']
  const enemy = ['..#....#..', '...####...', '.########.', '##.####.##', '##########', '#.#....#.#', '..##..##..']
  // rolling outline of the ground, one pixel per column
  const ground = Array.from({ length: 84 }, (_, x) => Math.round(43 - 1.6 * Math.abs(Math.sin(x / 6)) - Math.abs(Math.sin(x / 2.2 + 1))))
  const ink = '#1c2a1a'
  return (
    <svg viewBox="0 0 84 48" className="block size-full" shapeRendering="crispEdges" aria-hidden>
      <rect width="84" height="48" fill="#9db28a" />
      {[2, 8, 14].map((x) => (
        <Pixels key={x} rows={heart} x={x} y={2} fill={ink} />
      ))}
      {[zero, zero, four, zero, zero].map((d, i) => (
        <Pixels key={i} rows={d} x={62 + i * 4} y={2} fill={ink} />
      ))}
      <Pixels rows={ship} x={6} y={19} fill={ink} />
      <rect x={20} y={22} width={4} height={1} fill={ink} />
      <rect x={34} y={22} width={4} height={1} fill={ink} />
      <Pixels rows={enemy} x={66} y={14} fill={ink} />
      <Pixels rows={['.##.', '#..#', '.##.']} x={28} y={34} fill={ink} />
      <Pixels rows={['.###.', '#...#', '.###.']} x={52} y={35} fill={ink} />
      {ground.map((y, x) => (
        <rect key={x} x={x} y={y} width={1} height={1} fill={ink} />
      ))}
      <rect y={47} width={84} height={1} fill={ink} />
    </svg>
  )
}

const TETRIS: Record<string, string> = {
  c: '#00d4d4', y: '#e6d800', p: '#9a00d8', g: '#00c800', r: '#dc0000', o: '#e07000', b: '#0010e0', w: '#8a8a8a',
}

function TetrisCell({ x, y, k }: { x: number; y: number; k: string }) {
  return (
    <g>
      <rect x={x} y={y} width={5} height={5} fill={TETRIS[k]} />
      <rect x={x} y={y} width={5} height={1} fill="#fff" opacity="0.4" />
      <rect x={x} y={y} width={1} height={5} fill="#fff" opacity="0.25" />
      <rect x={x} y={y + 4} width={5} height={1} fill="#000" opacity="0.35" />
    </g>
  )
}

export function TetrisCover() {
  const stack = [
    'p.........',
    'p...yyg...',
    'pprryygg..',
    'prrpprggo.',
    'ggoppprro.',
    'gggoyyrbo.',
    'bbbooybbr.',
    'cbobpbbrc.',
    'cyypprrcc.',
  ]
  const S = 5
  const wx = 55
  const wy = 8
  const cells: { x: number; y: number; k: string }[] = []
  stack.forEach((row, j) =>
    row.split('').forEach((k, i) => {
      if (k !== '.') cells.push({ x: wx + i * S, y: wy + (20 - stack.length + j) * S, k })
    }),
  )
  for (let j = 3; j < 7; j++) cells.push({ x: wx + 9 * S, y: wy + j * S, k: 'c' }) // falling I
  for (let j = 0; j <= 20; j++) cells.push({ x: wx - S, y: wy + j * S, k: 'w' }, { x: wx + 10 * S, y: wy + j * S, k: 'w' })
  for (let i = 0; i < 10; i++) cells.push({ x: wx + i * S, y: wy + 20 * S, k: 'w' })
  return (
    <svg viewBox="0 0 160 120" className="block size-full" shapeRendering="crispEdges" aria-hidden>
      <rect width="160" height="120" fill="#1a1a1a" />
      <rect x={wx} y={wy} width={10 * S} height={20 * S} fill="#000" />
      {cells.map((c, i) => (
        <TetrisCell key={i} {...c} />
      ))}
      {/* next piece */}
      <rect x={117.5} y={12.5} width={26} height={20} fill="#000" stroke="#8a8a8a" strokeWidth="1" />
      {[[123, 18], [128, 18], [133, 18], [128, 23]].map(([x, y]) => (
        <TetrisCell key={`${x}-${y}`} x={x} y={y} k="p" />
      ))}
    </svg>
  )
}

export function PinballCover() {
  const dots = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2
    return { x: 56 + Math.cos(a) * 16, y: 80 + Math.sin(a) * 10, fill: i % 2 ? '#3fa0ff' : '#f2c230' }
  })
  const mono = 'var(--font-mono, monospace)'
  return (
    <svg viewBox="0 0 160 120" className="block size-full" aria-hidden>
      <defs>
        <radialGradient id="pinball-table" cx="0.5" cy="0.55" r="0.7">
          <stop offset="0" stopColor="#1d2a5c" />
          <stop offset="1" stopColor="#070a1c" />
        </radialGradient>
        <radialGradient id="pinball-core" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#d6f6ff" />
          <stop offset="0.35" stopColor="#3fb7e8" />
          <stop offset="1" stopColor="#0d2a55" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="160" height="120" fill="#1b1b22" />
      {/* table in perspective */}
      <path d="M18 3 H96 L104 117 H8 Z" fill="url(#pinball-table)" stroke="#7b7f8c" strokeWidth="2.5" />
      <path d="M26 46 C24 18 50 8 76 10 C92 12 96 26 95 40" fill="none" stroke="#9aa0ad" strokeWidth="1.6" />
      {/* purple ramp */}
      <path d="M22 52 C28 66 30 80 26 96" fill="none" stroke="#8e6fe0" strokeWidth="7" strokeLinecap="round" />
      <path d="M22 52 C28 66 30 80 26 96" fill="none" stroke="#c4b2ff" strokeWidth="1" strokeDasharray="2 3" />
      {/* bumpers */}
      {[[48, 26], [64, 22], [58, 38]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="5.5" fill="#eef0f5" />
          <circle cx={x} cy={y} r="3.6" fill="#d8323a" />
          <circle cx={x} cy={y} r="1.4" fill="#fff" />
        </g>
      ))}
      <path d="M74 46 L84 34 L82 52 Z" fill="#c8323a" />
      <circle cx="56" cy="80" r="13" fill="url(#pinball-core)" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="1.1" fill={d.fill} />
      ))}
      {/* flippers, ball, plunger lane */}
      <path d="M34 106 L52 111 L51 113 L33 109 Z" fill="#e8e8ec" stroke="#c0392b" strokeWidth="0.8" />
      <path d="M80 106 L62 111 L63 113 L81 109 Z" fill="#e8e8ec" stroke="#c0392b" strokeWidth="0.8" />
      <circle cx="70" cy="62" r="2.4" fill="#d9dde6" />
      <circle cx="69.3" cy="61.3" r="0.8" fill="#fff" />
      <path d="M95 46 L100 116" stroke="#7b7f8c" strokeWidth="1" />
      {/* side panel: art, ball counter, score, message */}
      <rect x="110" y="3" width="46" height="46" fill="#05050c" stroke="#9a9aa4" strokeWidth="1.5" />
      {[[116, 10], [148, 13], [124, 41], [150, 42], [138, 8]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="0.6" fill="#fff" />
      ))}
      <circle cx="133" cy="26" r="7.5" fill="#7c5fd6" />
      <ellipse cx="133" cy="26" rx="14" ry="4.5" fill="none" stroke="#b9a6ff" strokeWidth="1.2" transform="rotate(-14 133 26)" />
      <text x="123" y="60.5" fill="#e0262e" fontSize="6.5" fontWeight="700">BALL</text>
      <rect x="143" y="53.5" width="9" height="9" fill="#000" stroke="#e0262e" strokeWidth="1" />
      <text x="147.5" y="60.5" fill="#c8ccff" fontSize="7" textAnchor="middle" fontFamily={mono}>1</text>
      <rect x="110" y="67" width="46" height="11" fill="#000" stroke="#9a9aa4" strokeWidth="1.5" />
      <text x="152" y="75.5" fill="#9aa4ff" fontSize="7" textAnchor="end" fontFamily={mono}>0</text>
      <rect x="110" y="82" width="46" height="35" fill="#000" stroke="#9a9aa4" strokeWidth="1.5" />
      <text x="114" y="93" fill="#8f86ff" fontSize="5.5" fontFamily={mono}>Ready</text>
      <text x="114" y="101" fill="#8f86ff" fontSize="5.5" fontFamily={mono}>Launch ball</text>
    </svg>
  )
}

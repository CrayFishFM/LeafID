import type { QuestionId } from '@/data/leaf-key';

/*
 * Small line drawings for the leaf key's answers. Everything is drawn in a 64×64 box with
 * currentColor, so the diagrams follow the theme (the colour is set on .key-diagram).
 */

type Pt = [number, number];
const f = (n: number) => +n.toFixed(1);
const at = ([x, y]: Pt) => `${f(x)},${f(y)}`;
const poly = (pts: Pt[]) => `M${pts.map(at).join(' L')}Z`;

const LEAF = { fill: 'currentColor', fillOpacity: 0.16, stroke: 'currentColor', strokeWidth: 1.6, strokeLinejoin: 'round' as const };
const LINE = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const THIN = { ...LINE, strokeWidth: 0.9, opacity: 0.7 };

/** A pointed leaflet whose base sits at (x, y), `len` long, rotated `deg` clockwise from straight up. */
function Leaflet({ x, y, deg, len, w }: { x: number; y: number; deg: number; len: number; w: number }) {
  return <path {...LEAF} transform={`translate(${x} ${y}) rotate(${deg})`} d={`M0,0 Q${w},${-len / 2} 0,${-len} Q${-w},${-len / 2} 0,0Z`} />;
}

/** Hand-shaped (maple) leaf: `n` lobes, sinuses cut to `depth` (0 = to the centre, 1 = no notch). */
function Palmate({ n, depth }: { n: 3 | 5; depth: number }) {
  const c: Pt = [32, 40], r = 26;
  const angles = n === 5 ? [-112, -56, 0, 56, 112] : [-62, 0, 62];
  const p = (deg: number, rad: number): Pt => [c[0] + rad * Math.sin((deg * Math.PI) / 180), c[1] - rad * Math.cos((deg * Math.PI) / 180)];
  const pts: Pt[] = [[32, 44]];
  angles.forEach((a, i) => {
    // Shoulders either side of each tip give the lobes some width.
    const sh = n === 5 ? 13 : 18;
    pts.push(p(a - sh, r * Math.max(0.68, depth + 0.2)), p(a, r), p(a + sh, r * Math.max(0.68, depth + 0.2)));
    if (i < angles.length - 1) pts.push(p((a + angles[i + 1]) / 2, r * depth));
  });
  return (
    <>
      <path {...LEAF} d={poly(pts)} />
      {angles.map((a) => <line key={a} {...THIN} x1={32} y1={43} x2={f(p(a, r - 4)[0])} y2={f(p(a, r - 4)[1])} />)}
      <line {...LINE} x1={32} y1={44} x2={32} y2={61} />
    </>
  );
}

/** Feather-lobed (oak) leaf; `widths` are the lobe lengths from the base up. */
function Pinnate({ widths, rounded, bristles }: { widths: number[]; rounded?: boolean; bristles?: boolean }) {
  const n = widths.length, top = 17, bottom = 47, s = 4;
  const gap = (bottom - top) / (n - 1) / 2;
  const ys = widths.map((_, i) => bottom - i * 2 * gap);
  const side = (dir: 1 | -1) => {
    // Lobes from the base up for the right side, top down (mirrored) for the left.
    const order = dir === 1 ? ys.map((_, i) => i) : ys.map((_, i) => n - 1 - i);
    return order.map((i) => {
      const y = ys[i], w = widths[i], x = (d: number) => f(32 + dir * d);
      const [from, to] = dir === 1 ? [y + gap, y - gap] : [y - gap, y + gap];
      return rounded
        ? `L${x(s)},${f(from)} C${x(w * 1.3)},${f(from + (to - from) * -0.1)} ${x(w * 1.3)},${f(to + (to - from) * 0.1)} ${x(s)},${f(to)}`
        : `L${x(s)},${f(from)} L${x(w)},${f(y)} L${x(s)},${f(to)}`;
    }).join(' ');
  };
  const d = `M32,54 ${side(1)} L32,6 ${side(-1)} Z`;
  return (
    <>
      <path {...LEAF} d={d} />
      <line {...THIN} x1={32} y1={8} x2={32} y2={54} />
      {bristles && ys.flatMap((y, i) => [1, -1].map((dir) => (
        <line key={`${i}${dir}`} {...LINE} strokeWidth={1} x1={32 + dir * widths[i]} y1={y} x2={32 + dir * (widths[i] + 3.5)} y2={y - 1.5} />
      )))}
      <line {...LINE} x1={32} y1={54} x2={32} y2={62} />
    </>
  );
}

function Outline({ d, stalk = 52 }: { d: string; stalk?: number }) {
  return (
    <>
      <path {...LEAF} d={d} />
      <line {...THIN} x1={32} y1={10} x2={32} y2={stalk} />
      <line {...LINE} x1={32} y1={stalk} x2={32} y2={61} />
    </>
  );
}

const OVAL = 'M32,6 C44,16 46,34 40,46 C37,51 34,52 32,52 C30,52 27,51 24,46 C18,34 20,16 32,6Z';

/** Compound leaf: `pairs` of side leaflets, with or without one at the tip. */
function Compound({ pairs, end = true }: { pairs: number; end?: boolean }) {
  const top = end ? 18 : 12, bottom = 50;
  const step = pairs > 1 ? (bottom - top) / (pairs - 1) : 0;
  const len = Math.min(16, 6 + step * 1.4), w = len / 3;
  return (
    <>
      <line {...LINE} x1={32} y1={62} x2={32} y2={end ? top : top - 2} />
      {Array.from({ length: pairs }, (_, i) => bottom - i * step).map((y) => (
        <g key={y}>
          <Leaflet x={32} y={y} deg={-68} len={len} w={w} />
          <Leaflet x={32} y={y} deg={68} len={len} w={w} />
        </g>
      ))}
      {end && <Leaflet x={32} y={top} deg={0} len={len} w={w} />}
    </>
  );
}

/** A strip of leaf edge seen up close. */
function Margin({ kind }: { kind: 'smooth' | 'fine' | 'coarse' | 'double' }) {
  const y = 30;
  let edge: Pt[] = [];
  if (kind === 'smooth') {
    edge = Array.from({ length: 15 }, (_, i): Pt => [4 + i * 4, y + Math.sin(i / 2.2) * 1.5]);
  } else {
    const [step, h] = kind === 'fine' ? [5.6, 3.5] : [14, 9];
    for (let x = 4; x < 60 - 0.1; x += step) {
      edge.push([x, y]);
      if (kind === 'double') edge.push([x + step * 0.3, y - h * 0.3], [x + step * 0.36, y - h * 0.18], [x + step * 0.62, y - h * 0.62], [x + step * 0.68, y - h * 0.48]);
      edge.push([x + step * 0.85, y - h]);
    }
    edge.push([60, y]);
  }
  return <path {...LEAF} d={poly([...edge, [60, 58], [4, 58]])} />;
}

function Bark({ kind }: { kind: 'papery' | 'curly' | 'shaggy' | 'smooth' | 'furrowed' | 'scaly' }) {
  const body = <rect x={14} y={4} width={36} height={56} rx={3} fill="currentColor" fillOpacity={kind === 'papery' ? 0.04 : kind === 'scaly' ? 0.32 : 0.16} stroke="currentColor" strokeWidth={1.6} />;
  const lines: React.ReactNode[] = [];
  if (kind === 'papery' || kind === 'smooth') {
    // Horizontal lenticels; papery bark also gets a peeling sheet.
    [[20, 12], [34, 18], [22, 30], [36, 40], [24, 50]].forEach(([x, y]) => lines.push(<line key={`${x}${y}`} {...LINE} x1={x} y1={y} x2={x + (kind === 'papery' ? 9 : 5)} y2={y} />));
    if (kind === 'papery') lines.push(<path key="peel" {...LEAF} fillOpacity={0.3} d="M38,24 C44,24 49,26 50,30 C46,29 43,31 42,34 C40,30 38,27 38,24Z" />);
  } else if (kind === 'curly') {
    [10, 20, 30, 40, 50].forEach((y, i) => lines.push(<path key={y} {...LINE} d={`M${16 + (i % 2) * 6},${y} C${26 + (i % 2) * 6},${y - 4} ${36 + (i % 2) * 6},${y - 4} ${40 + (i % 2) * 6},${y} c2,2 0,4 -2,3`} />));
  } else if (kind === 'shaggy') {
    [[19, 8], [25, 18], [31, 6], [37, 20], [43, 10], [21, 34], [29, 30], [35, 40], [42, 34], [24, 46], [39, 48]].forEach(([x, y]) =>
      lines.push(<path key={`${x}${y}`} {...LINE} strokeWidth={1.3} d={`M${x - 1.5},${y} L${x},${y + 3} L${x},${y + 9} L${x + 1.5},${y + 12}`} />));
  } else if (kind === 'scaly') {
    // Small staggered plates, each with a lifted, curled edge.
    [[17, 7], [32, 9], [22, 19], [37, 21], [17, 31], [31, 33], [23, 44], [37, 46]].forEach(([x, y]) =>
      lines.push(<path key={`${x}${y}`} {...LINE} strokeWidth={1.3} d={`M${x},${y + 9} L${x},${y} L${x + 11},${y} L${x + 11},${y + 7} c-2,3 -6,3 -8,2`} />));
  } else {
    // Furrowed: wavy vertical ridges that merge into a diamond pattern.
    [20, 28, 36, 44].forEach((x, i) => lines.push(<path key={x} {...LINE} d={`M${x},4 C${x + (i % 2 ? -4 : 4)},18 ${x + (i % 2 ? 4 : -4)},30 ${x},34 C${x + (i % 2 ? -4 : 4)},42 ${x + (i % 2 ? 4 : -4)},52 ${x},60`} />));
  }
  return <>{body}{lines}</>;
}

/** A length of sapling stem in its real colour, with lenticels, curls or scars on it. */
function YoungBark({ kind }: { kind: 'pale' | 'green' | 'grey' | 'reddish' | 'bronze' | 'speckled' }) {
  const fill = { pale: '#e4e6d2', green: '#a3b27a', grey: '#a7a7a0', reddish: '#86473a', bronze: '#c99a4c', speckled: '#75695d' }[kind];
  const marks: React.ReactNode[] = [];
  if (kind === 'reddish') {
    [10, 18, 27, 36, 45, 54].forEach((y, i) => marks.push(<line key={y} x1={i % 2 ? 28 : 31} y1={y} x2={i % 2 ? 35 : 38} y2={y} stroke="#f1e6d8" strokeWidth={1.4} strokeLinecap="round" />));
  } else if (kind === 'speckled') {
    [[28, 9], [35, 14], [30, 21], [37, 27], [27, 32], [33, 38], [29, 46], [36, 50], [31, 56]].forEach(([x, y]) =>
      marks.push(<ellipse key={`${x}${y}`} cx={x} cy={y} rx={1.8} ry={1.1} fill="#f0b968" />));
  } else if (kind === 'pale') {
    marks.push(<path key="scar1" d="M27,20 L32,24 L37,20" fill="none" stroke="#2b2b2b" strokeWidth={1.6} strokeLinecap="round" />);
    marks.push(<ellipse key="scar2" cx={33} cy={44} rx={3} ry={1.5} fill="#2b2b2b" />);
  } else if (kind === 'bronze') {
    [14, 30, 46].forEach((y) => marks.push(<path key={y} d={`M25,${y} C30,${y - 3} 36,${y - 3} 40,${y} c2,2 0,4 -2,3`} fill="none" stroke="#6b4a1c" strokeWidth={1.2} strokeLinecap="round" />));
  }
  return (
    <>
      <rect x={24} y={3} width={16} height={58} rx={8} fill={fill} stroke="currentColor" strokeWidth={1.6} />
      <path d="M40,22 L52,12" stroke="currentColor" strokeWidth={4} strokeLinecap="round" />
      <path d="M40,22 L52,12" stroke={fill} strokeWidth={2} strokeLinecap="round" />
      {marks}
    </>
  );
}

const DIAGRAMS: Partial<Record<QuestionId, Record<string, () => React.ReactNode>>> = {
  arrangement: {
    opposite: () => (
      <>
        <line {...LINE} x1={32} y1={4} x2={32} y2={62} />
        {[18, 42].map((y) => <g key={y}><Leaflet x={32} y={y} deg={-58} len={20} w={6} /><Leaflet x={32} y={y} deg={58} len={20} w={6} /></g>)}
      </>
    ),
    alternate: () => (
      <>
        <line {...LINE} x1={32} y1={4} x2={32} y2={62} />
        <Leaflet x={32} y={14} deg={58} len={20} w={6} />
        <Leaflet x={32} y={32} deg={-58} len={20} w={6} />
        <Leaflet x={32} y={50} deg={58} len={20} w={6} />
      </>
    ),
  },
  leafType: {
    simple: () => <Outline d={OVAL} />,
    compound: () => <Compound pairs={3} />,
  },
  leaflets: {
    few: () => <Compound pairs={2} />,
    many: () => <Compound pairs={6} />,
  },
  lobes: {
    palmate: () => <Palmate n={5} depth={0.45} />,
    pinnate: () => <Pinnate widths={[11, 16, 17, 12]} rounded />,
    none: () => <Outline d={OVAL} />,
  },
  lobeCount: {
    3: () => <Palmate n={3} depth={0.5} />,
    5: () => <Palmate n={5} depth={0.5} />,
  },
  lobeDepth: {
    shallow: () => <Palmate n={5} depth={0.62} />,
    deep: () => <Palmate n={5} depth={0.18} />,
  },
  lobeTips: {
    pointed: () => <Pinnate widths={[12, 17, 18, 13]} bristles />,
    rounded: () => <Pinnate widths={[11, 16, 17, 12]} rounded />,
  },
  widest: {
    middle: () => <Pinnate widths={[11, 16, 17, 12]} rounded />,
    tip: () => <Pinnate widths={[9, 6, 17, 19]} rounded />,
  },
  shape: {
    round: () => <Outline d="M32,10 C46,11 54,24 52,36 C50,47 40,52 32,52 C24,52 14,47 12,36 C10,24 18,11 32,10Z" />,
    oval: () => <Outline d={OVAL} />,
    heart: () => <Outline stalk={44} d="M32,6 C40,15 54,24 54,38 C54,48 44,52 38,50 C35,49 33,47 32,44 C31,47 29,49 26,50 C20,52 10,48 10,38 C10,24 24,15 32,6Z" />,
    triangle: () => <Outline stalk={49} d="M32,6 C38,18 48,34 54,46 C46,50 18,50 10,46 C16,34 26,18 32,6Z" />,
    lance: () => <Outline d="M32,4 C37,16 39,34 37,46 C35,51 33,52 32,52 C31,52 29,51 27,46 C25,34 27,16 32,4Z" />,
  },
  petiole: {
    // Cross-sections of the stalk, with a short length of stalk above.
    flat: () => <><path {...LEAF} d="M28,6 L36,6 L36,30 L28,30Z" /><ellipse {...LEAF} cx={32} cy={46} rx={18} ry={4} /></>,
    round: () => <><path {...LEAF} d="M29,6 L35,6 L35,30 L29,30Z" /><circle {...LEAF} cx={32} cy={46} r={8} /></>,
  },
  base: {
    even: () => <Outline d={OVAL} />,
    lopsided: () => (
      <>
        <path {...LEAF} d="M32,6 C46,16 48,36 40,48 C37,52 34,54 32,54 L32,44 C26,43 21,37 21,29 C21,19 26,12 32,6Z" />
        <line {...THIN} x1={32} y1={10} x2={32} y2={54} />
        <line {...LINE} x1={32} y1={54} x2={32} y2={62} />
      </>
    ),
  },
  margin: {
    smooth: () => <Margin kind="smooth" />,
    fine: () => <Margin kind="fine" />,
    coarse: () => <Margin kind="coarse" />,
    double: () => <Margin kind="double" />,
  },
  endLeaflet: {
    present: () => <Compound pairs={3} />,
    absent: () => <Compound pairs={4} end={false} />,
  },
  twig: {
    velvety: () => (
      <>
        <path {...LINE} strokeWidth={5} d="M22,62 L30,30 L24,8 M30,30 L44,12" />
        {[[26, 50], [28, 42], [24, 20], [27, 14], [36, 24], [40, 18], [29, 34]].map(([x, y]) => (
          <g key={`${x}${y}`}>
            <line {...LINE} strokeWidth={1} x1={x - 3} y1={y - 2} x2={x - 6} y2={y - 3} />
            <line {...LINE} strokeWidth={1} x1={x + 3} y1={y} x2={x + 6} y2={y - 1} />
          </g>
        ))}
      </>
    ),
    smooth: () => <path {...LINE} strokeWidth={3} d="M22,62 L30,30 L24,8 M30,30 L44,12" />,
  },
  youngBark: {
    pale: () => <YoungBark kind="pale" />,
    green: () => <YoungBark kind="green" />,
    grey: () => <YoungBark kind="grey" />,
    reddish: () => <YoungBark kind="reddish" />,
    bronze: () => <YoungBark kind="bronze" />,
    speckled: () => <YoungBark kind="speckled" />,
  },
  bark: {
    papery: () => <Bark kind="papery" />,
    curly: () => <Bark kind="curly" />,
    shaggy: () => <Bark kind="shaggy" />,
    smooth: () => <Bark kind="smooth" />,
    furrowed: () => <Bark kind="furrowed" />,
    scaly: () => <Bark kind="scaly" />,
  },
  habit: {
    shrub: () => (
      <>
        <line {...LINE} x1={4} y1={60} x2={60} y2={60} />
        <path {...LINE} d="M32,60 L22,40 M32,60 L32,36 M32,60 L42,40" />
        {[[20, 36, 10], [32, 30, 11], [44, 36, 10]].map(([cx, cy, r]) => <circle key={cx} {...LEAF} cx={cx} cy={cy} r={r} />)}
      </>
    ),
    tree: () => (
      <>
        <line {...LINE} x1={4} y1={60} x2={60} y2={60} />
        <path {...LEAF} d="M29,60 L30,34 L34,34 L35,60Z" />
        <circle {...LEAF} cx={32} cy={22} r={18} />
      </>
    ),
  },
};

export function KeyDiagram({ q, value }: { q: QuestionId; value: string }) {
  const draw = DIAGRAMS[q]?.[value];
  if (!draw) return null;
  return <svg className="key-diagram" viewBox="0 0 64 64" aria-hidden="true">{draw()}</svg>;
}

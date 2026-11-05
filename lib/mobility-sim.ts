/*
 * Mobility simulation: synthetic agents travel between hubs on a synthetic
 * street grid, routed by shortest path. Decorative only, not real data.
 * Pauses when off-screen or in a hidden tab; draws one still frame when the
 * visitor prefers reduced motion.
 */

export type SimGroup = {
  rgb: [number, number, number];
  weight: number;
  alpha?: number;
};

export type SimColors = {
  palette: SimGroup[];
  street: string;
  streetArt: string;
  hub?: string | null;
  blend?: GlobalCompositeOperation;
};

export type SimOptions = SimColors & {
  /** Agents per 10,000 px² of canvas. */
  density: number;
  cell: number;
  seed: number;
  hubs: number;
  history: number;
  tiers: number;
  speed: [number, number];
  arterialBoost: number;
  lineWidth: number;
  headRadius: number;
  trailAlpha: number;
  headAlpha: number;
  stayAlpha: number;
  warm: number;
  hstep: number;
  hubBias: number;
};

export type SimHandle = {
  setColors(colors: SimColors): void;
  destroy(): void;
};

type Edge = { to: number; len: number; art: boolean; cost: number };
type Node = { x: number; y: number; adj: Edge[] };
type Seg = { x0: number; y0: number; x1: number; y1: number; len: number; art: boolean };
type Agent = {
  node: number;
  dest: number;
  x: number;
  y: number;
  segs: Seg[];
  seg: number;
  t: number;
  moving: boolean;
  dwell: number;
  speed: number;
  hist: Float32Array;
  h: number;
  fc: number;
  group: number;
};

const TAU = Math.PI * 2;

const DEFAULTS: Omit<SimOptions, keyof SimColors> = {
  density: 24,
  cell: 24,
  seed: 11,
  hubs: 5,
  history: 46,
  tiers: 6,
  speed: [22, 48],
  arterialBoost: 1.45,
  lineWidth: 1.1,
  headRadius: 1.5,
  trailAlpha: 0.7,
  headAlpha: 0.95,
  stayAlpha: 0.35,
  warm: 360,
  hstep: 2,
  hubBias: 0.7,
};

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type HeapItem = [number, number];

function heapPush(h: HeapItem[], item: HeapItem) {
  h.push(item);
  let i = h.length - 1;
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (h[p][0] <= h[i][0]) break;
    [h[p], h[i]] = [h[i], h[p]];
    i = p;
  }
}

function heapPop(h: HeapItem[]): HeapItem {
  const top = h[0];
  const last = h.pop()!;
  if (h.length) {
    h[0] = last;
    let i = 0;
    for (;;) {
      const l = 2 * i + 1;
      const r = l + 1;
      let m = i;
      if (l < h.length && h[l][0] < h[m][0]) m = l;
      if (r < h.length && h[r][0] < h[m][0]) m = r;
      if (m === i) break;
      [h[m], h[i]] = [h[i], h[m]];
      i = m;
    }
  }
  return top;
}

function buildNetwork(W: number, H: number, R: () => number, cell: number) {
  const cols = Math.max(6, Math.round(W / cell)) + 1;
  const rows = Math.max(4, Math.round(H / cell)) + 1;
  const dx = W / (cols - 1);
  const dy = H / (rows - 1);
  const nodes: Node[] = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const edge = i === 0 || j === 0 || i === cols - 1 || j === rows - 1;
      nodes.push({
        x: i * dx + (edge ? 0 : (R() - 0.5) * dx * 0.4),
        y: j * dy + (edge ? 0 : (R() - 0.5) * dy * 0.4),
        adj: [],
      });
    }
  }
  const id = (a: number, b: number) => b * cols + a;
  const link = (a: number, b: number, art: boolean) => {
    const A = nodes[a];
    const B = nodes[b];
    const len = Math.hypot(A.x - B.x, A.y - B.y);
    const cost = len * (art ? 0.55 : 1);
    A.adj.push({ to: b, len, art, cost });
    B.adj.push({ to: a, len, art, cost });
  };
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      if (i < cols - 1) {
        const ah = j % 4 === 0;
        if (ah || R() < 0.9) link(id(i, j), id(i + 1, j), ah);
      }
      if (j < rows - 1) {
        const av = i % 6 === 0;
        if (av || R() < 0.9) link(id(i, j), id(i, j + 1), av);
      }
      if (i < cols - 1 && j < rows - 1 && R() < 0.06) {
        link(id(i, j), id(i + 1, j + 1), false);
      }
    }
  }
  // Keep only the component reachable from node 0 so every route exists.
  const seen = new Uint8Array(nodes.length);
  const comp: number[] = [];
  const stack = [0];
  seen[0] = 1;
  while (stack.length) {
    const n = stack.pop()!;
    comp.push(n);
    for (const e of nodes[n].adj) {
      if (!seen[e.to]) {
        seen[e.to] = 1;
        stack.push(e.to);
      }
    }
  }
  return { nodes, comp };
}

function route(nodes: Node[], s: number, t: number) {
  const n = nodes.length;
  const dist = new Float32Array(n).fill(Infinity);
  const prev = new Int32Array(n).fill(-1);
  const h: HeapItem[] = [];
  dist[s] = 0;
  heapPush(h, [0, s]);
  while (h.length) {
    const [d, u] = heapPop(h);
    if (d > dist[u]) continue;
    if (u === t) break;
    for (const e of nodes[u].adj) {
      const nd = d + e.cost;
      if (nd < dist[e.to]) {
        dist[e.to] = nd;
        prev[e.to] = u;
        heapPush(h, [nd, e.to]);
      }
    }
  }
  const path: number[] = [];
  for (let v = t; v !== -1; v = prev[v]) path.push(v);
  path.reverse();
  return path[0] === s ? path : null;
}

export function createMobilitySim(
  host: HTMLElement,
  colors: SimColors,
  options: Partial<Omit<SimOptions, keyof SimColors>> = {}
): SimHandle {
  const o: SimOptions = { ...DEFAULTS, ...options, ...colors };

  const streetsCanvas = document.createElement("canvas");
  const trailsCanvas = document.createElement("canvas");
  for (const c of [streetsCanvas, trailsCanvas]) {
    c.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;display:block";
    host.appendChild(c);
  }
  const sctx = streetsCanvas.getContext("2d")!;
  const tctx = trailsCanvas.getContext("2d")!;

  let W = 0;
  let H = 0;
  let net: ReturnType<typeof buildNetwork> | null = null;
  let agents: Agent[] = [];
  let groupLists: Agent[][] = [];
  let hubs: number[] = [];
  let hubW: number[] = [];
  let raf = 0;
  let last = 0;
  let visible = true;
  let R = rng(o.seed);
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function pickDest() {
    const comp = net!.comp;
    if (R() < o.hubBias) {
      let total = 0;
      for (const w of hubW) total += w;
      let p = R() * total;
      for (let k = 0; k < hubs.length; k++) {
        if (p < hubW[k]) return hubs[k];
        p -= hubW[k];
      }
    }
    return comp[Math.floor(R() * comp.length)];
  }

  function plan(a: Agent) {
    let dest = a.node;
    for (let guard = 0; dest === a.node && guard < 6; guard++) dest = pickDest();
    const path = route(net!.nodes, a.node, dest);
    if (!path || path.length < 2) {
      a.dwell = 0.5;
      return;
    }
    a.dest = dest;
    a.segs = [];
    for (let k = 0; k < path.length - 1; k++) {
      const A = net!.nodes[path[k]];
      const B = net!.nodes[path[k + 1]];
      const e = A.adj.find((q) => q.to === path[k + 1])!;
      a.segs.push({ x0: A.x, y0: A.y, x1: B.x, y1: B.y, len: e.len, art: e.art });
    }
    a.seg = 0;
    a.t = 0;
    a.moving = true;
  }

  function step(dt: number) {
    for (const a of agents) {
      if (!a.moving) {
        a.dwell -= dt;
        if (a.dwell <= 0) plan(a);
      } else {
        let s = a.segs[a.seg];
        a.t += (a.speed * (s.art ? o.arterialBoost : 1) * dt) / s.len;
        while (a.t >= 1 && a.moving) {
          a.t -= 1;
          a.seg++;
          if (a.seg >= a.segs.length) {
            a.moving = false;
            a.node = a.dest;
            a.dwell = 0.6 + R() * 3;
            a.x = net!.nodes[a.node].x;
            a.y = net!.nodes[a.node].y;
            break;
          }
          s = a.segs[a.seg];
        }
        if (a.moving) {
          s = a.segs[a.seg];
          a.x = s.x0 + (s.x1 - s.x0) * a.t;
          a.y = s.y0 + (s.y1 - s.y0) * a.t;
        }
      }
      a.fc = (a.fc + 1) % o.hstep;
      if (a.fc === 0) {
        a.h = (a.h + 1) % o.history;
        a.hist[a.h * 2] = a.x;
        a.hist[a.h * 2 + 1] = a.y;
      }
    }
  }

  function drawStreets() {
    sctx.clearRect(0, 0, W, H);
    if (!net) return;
    const pass = (art: boolean) => {
      sctx.beginPath();
      net!.nodes.forEach((A, i) => {
        for (const e of A.adj) {
          if (e.to > i && e.art === art) {
            const B = net!.nodes[e.to];
            sctx.moveTo(A.x, A.y);
            sctx.lineTo(B.x, B.y);
          }
        }
      });
      sctx.strokeStyle = art ? o.streetArt : o.street;
      sctx.lineWidth = art ? 1.3 : 1;
      sctx.stroke();
    };
    pass(false);
    pass(true);
    if (o.hub) {
      sctx.strokeStyle = o.hub;
      sctx.lineWidth = 1;
      for (const hub of hubs) {
        const N = net.nodes[hub];
        sctx.beginPath();
        sctx.arc(N.x, N.y, 4.5, 0, TAU);
        sctx.stroke();
      }
    }
  }

  function draw() {
    tctx.clearRect(0, 0, W, H);
    tctx.globalCompositeOperation = o.blend ?? "source-over";
    tctx.lineCap = "round";
    tctx.lineJoin = "round";
    const K = o.history;
    const T = o.tiers;
    const per = Math.ceil((K - 1) / T);
    o.palette.forEach((group, g) => {
      const list = groupLists[g] ?? [];
      const rgb = `rgb(${group.rgb.join(",")})`;
      const ga = group.alpha ?? 1;
      tctx.strokeStyle = rgb;
      tctx.lineWidth = o.lineWidth;
      for (let t = 0; t < T; t++) {
        const path = new Path2D();
        const s0 = t * per;
        const s1 = Math.min((t + 1) * per, K - 1);
        for (const a of list) {
          for (let s = s0; s < s1; s++) {
            const i1 = (a.h - s + K) % K;
            const i0 = (a.h - s - 1 + K) % K;
            const x1 = a.hist[i1 * 2];
            const y1 = a.hist[i1 * 2 + 1];
            const x0 = a.hist[i0 * 2];
            const y0 = a.hist[i0 * 2 + 1];
            if (x0 === x1 && y0 === y1) continue;
            path.moveTo(x0, y0);
            path.lineTo(x1, y1);
          }
          if (t === 0 && a.moving) {
            path.moveTo(a.hist[a.h * 2], a.hist[a.h * 2 + 1]);
            path.lineTo(a.x, a.y);
          }
        }
        tctx.globalAlpha = o.trailAlpha * ga * Math.pow(1 - t / T, 1.8);
        tctx.stroke(path);
      }
      tctx.fillStyle = rgb;
      const dots = (moving: boolean, alpha: number) => {
        tctx.globalAlpha = alpha * ga;
        tctx.beginPath();
        for (const a of list) {
          if (a.moving !== moving) continue;
          tctx.moveTo(a.x + o.headRadius, a.y);
          tctx.arc(a.x, a.y, o.headRadius, 0, TAU);
        }
        tctx.fill();
      };
      dots(true, o.headAlpha);
      dots(false, o.stayAlpha);
    });
    tctx.globalAlpha = 1;
    tctx.globalCompositeOperation = "source-over";
  }

  function setup() {
    const r = host.getBoundingClientRect();
    W = Math.max(120, Math.round(r.width));
    H = Math.max(60, Math.round(r.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    for (const c of [streetsCanvas, trailsCanvas]) {
      c.width = Math.round(W * dpr);
      c.height = Math.round(H * dpr);
    }
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    R = rng(o.seed);
    net = buildNetwork(W, H, R, o.cell);
    const comp = net.comp;
    hubs = [];
    hubW = [];
    for (let k = 0; k < o.hubs; k++) {
      hubs.push(comp[Math.floor(R() * comp.length)]);
      hubW.push(1 + R() * 3);
    }
    const weights = o.palette.map((p) => p.weight);
    const totalW = weights.reduce((s, w) => s + w, 0);
    const count = Math.round(((W * H) / 10000) * o.density);
    agents = [];
    for (let i = 0; i < count; i++) {
      const n = comp[Math.floor(R() * comp.length)];
      const A = net.nodes[n];
      let pick = R() * totalW;
      let group = 0;
      for (let q = 0; q < weights.length; q++) {
        if (pick < weights[q]) {
          group = q;
          break;
        }
        pick -= weights[q];
      }
      const hist = new Float32Array(o.history * 2);
      for (let k = 0; k < o.history; k++) {
        hist[k * 2] = A.x;
        hist[k * 2 + 1] = A.y;
      }
      agents.push({
        node: n,
        dest: n,
        x: A.x,
        y: A.y,
        segs: [],
        seg: 0,
        t: 0,
        moving: false,
        dwell: R() * 2.4,
        speed: o.speed[0] + R() * (o.speed[1] - o.speed[0]),
        hist,
        h: 0,
        fc: 0,
        group,
      });
    }
    groupLists = o.palette.map((_, g) => agents.filter((a) => a.group === g));
    drawStreets();
    for (let f = 0; f < o.warm; f++) step(1 / 60);
    draw();
  }

  function frame(ts: number) {
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) {
      last = ts;
      return;
    }
    const dt = Math.min(0.05, (ts - last) / 1000 || 1 / 60);
    last = ts;
    step(dt);
    draw();
  }

  function start() {
    if (motion.matches || raf) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  const onMotionChange = () => (motion.matches ? stop() : start());
  motion.addEventListener("change", onMotionChange);

  const io = new IntersectionObserver((entries) => {
    visible = entries[0]?.isIntersecting ?? true;
  });
  io.observe(host);

  let pending: ReturnType<typeof setTimeout> | undefined;
  let firstSize = true;
  const ro = new ResizeObserver(() => {
    if (firstSize) {
      firstSize = false;
      return;
    }
    clearTimeout(pending);
    pending = setTimeout(setup, 150);
  });
  ro.observe(host);

  setup();
  start();

  return {
    setColors(next) {
      const sameGroups = next.palette.length === o.palette.length;
      Object.assign(o, next);
      if (!sameGroups) {
        setup();
        return;
      }
      drawStreets();
      draw();
    },
    destroy() {
      stop();
      clearTimeout(pending);
      io.disconnect();
      ro.disconnect();
      motion.removeEventListener("change", onMotionChange);
      streetsCanvas.remove();
      trailsCanvas.remove();
    },
  };
}

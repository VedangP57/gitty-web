import { createSignal, For, Match, Show, Switch } from 'solid-js';

type Kind = 'add' | 'del' | 'ctx' | 'hunk';

type Line = {
  kind: Kind;
  text: string;
  staged?: boolean;
};

// One row of the commit graph. Lane 0 is the checked-out branch, drawn heavy.
type Graph = {
  node: number;
  kind: 'commit' | 'merge' | 'head';
  // vertical lines as [lane, from, to], in percent of the row height
  lines: [number, number, number][];
  // a lane joined to the node by a horizontal line (a merge in, or a branch out)
  join?: number;
};

type Commit = {
  sha: string;
  subject: string;
  author: string;
  when: string;
  refs: string[];
  graph: Graph;
  file: string;
  lines: Line[];
};

const MAIN: Graph = { node: 0, kind: 'commit', lines: [[0, 0, 100]] };

const GRAPH_FIX: Line[] = [
  { kind: 'hunk', text: '@@ -212,7 +212,8 @@ fn place_merge(' },
  { kind: 'ctx', text: '    let first = lanes.claim(commit.parents[0]);' },
  { kind: 'del', text: '    let second = lanes.claim(commit.parents[1]);' },
  {
    kind: 'add',
    text: "    // a tip merge's second parent gets a lane of its own",
  },
  {
    kind: 'add',
    text: '    let second = lanes.open_beside(first, commit.parents[1]);',
  },
  { kind: 'ctx', text: '    edges.push(Edge::merge(first, second));' },
];

const COMMITS: Commit[] = [
  {
    sha: 'cf8a742',
    subject: 'Merge pull request #17 from graph-merge-tip',
    author: 'vedang',
    when: '1 hour ago',
    refs: ['HEAD', 'main', 'v0.2.0'],
    graph: {
      node: 0,
      kind: 'head',
      lines: [
        [0, 50, 100],
        [1, 50, 100],
      ],
      join: 1,
    },
    file: 'src/graph.rs',
    lines: GRAPH_FIX,
  },
  {
    sha: 'f372340',
    subject: "graph: keep a tip merge's second parent out of its column",
    author: 'vedang',
    when: '2 hours ago',
    refs: ['graph-merge-tip'],
    graph: {
      node: 1,
      kind: 'commit',
      lines: [
        [0, 0, 100],
        [1, 0, 100],
      ],
    },
    file: 'src/graph.rs',
    lines: GRAPH_FIX,
  },
  {
    sha: '0bc3f1c',
    subject: 'history: publish rows without holding the write lock',
    author: 'vedang',
    when: '3 hours ago',
    refs: [],
    graph: {
      node: 0,
      kind: 'commit',
      lines: [
        [0, 0, 100],
        [1, 0, 50],
      ],
      join: 1,
    },
    file: 'src/history.rs',
    lines: [
      { kind: 'hunk', text: '@@ -148,6 +148,11 @@ impl History {' },
      { kind: 'ctx', text: '    pub fn walk(&mut self) {' },
      { kind: 'del', text: '        let _guard = self.write.lock();' },
      { kind: 'add', text: '        let mut chunk = Vec::with_capacity(ROWS_BATCH);', staged: true },
      { kind: 'ctx', text: '        while let Some(pos) = self.heap.pop() {' },
      { kind: 'add', text: '            chunk.push(self.decode(pos));', staged: true },
      { kind: 'ctx', text: '        }' },
      { kind: 'add', text: '        self.append(chunk);', staged: true },
      { kind: 'ctx', text: '    }' },
    ],
  },
  {
    sha: '641cd8f',
    subject: 'stage: exact reverse headers for line unstage',
    author: 'vedang',
    when: 'yesterday',
    refs: [],
    graph: MAIN,
    file: 'src/stage.rs',
    lines: [
      { kind: 'hunk', text: '@@ -72,7 +72,9 @@ pub fn build(' },
      { kind: 'ctx', text: '    let header = file_header(path, old, new);' },
      { kind: 'del', text: '    let reverse = file_header(path, new, old);' },
      { kind: 'add', text: '    // old and new swap, modes do not' },
      { kind: 'add', text: '    let reverse = file_header_exact(path, new, old);' },
      { kind: 'ctx', text: '    Patch { header, reverse }' },
    ],
  },
  {
    sha: '9f20a4d',
    subject: 'diff: cap intraline work per block',
    author: 'vedang',
    when: '3 days ago',
    refs: ['v0.1.2'],
    graph: MAIN,
    file: 'src/intraline.rs',
    lines: [
      { kind: 'hunk', text: '@@ -31,6 +31,10 @@ fn pair_words(' },
      { kind: 'ctx', text: '    for (a, b) in left.iter().zip(right) {' },
      { kind: 'add', text: '        if spent > BUDGET {' },
      { kind: 'add', text: '            break;' },
      { kind: 'add', text: '        }' },
      { kind: 'ctx', text: '        spent += a.distance(b);' },
    ],
  },
  {
    sha: '2ae77b1',
    subject: 'perf: first frame down to 14 ms',
    author: 'vedang',
    when: 'last week',
    refs: [],
    graph: MAIN,
    file: 'src/run.rs',
    lines: [
      { kind: 'hunk', text: '@@ -203,6 +203,8 @@ fn draw(' },
      { kind: 'ctx', text: '    let start = Instant::now();' },
      { kind: 'add', text: '    // draw once per event batch, never on a tick' },
      { kind: 'add', text: '    buf.flush()?;' },
      { kind: 'ctx', text: '    metrics.frame(start.elapsed());' },
    ],
  },
  {
    sha: 'a41e9c2',
    subject: 'search: stream matches while the walk continues',
    author: 'vedang',
    when: '8 days ago',
    refs: [],
    graph: MAIN,
    file: 'src/search.rs',
    lines: [
      { kind: 'hunk', text: '@@ -54,7 +54,9 @@ impl Search {' },
      { kind: 'ctx', text: '    pub fn run(&mut self, query: &Query) {' },
      { kind: 'del', text: '        let all = self.walk().collect::<Vec<_>>();' },
      { kind: 'add', text: '        for commit in self.walk() {' },
      { kind: 'add', text: '            if query.matches(&commit) { self.emit(commit); }' },
      { kind: 'add', text: '        }' },
      { kind: 'ctx', text: '    }' },
    ],
  },
  {
    sha: 'e07b3d9',
    subject: 'push: show progress and allow cancel',
    author: 'vedang',
    when: '9 days ago',
    refs: [],
    graph: MAIN,
    file: 'src/net.rs',
    lines: [
      { kind: 'hunk', text: '@@ -19,6 +19,10 @@ pub fn push(' },
      { kind: 'ctx', text: '    let mut child = git.spawn()?;' },
      { kind: 'add', text: '    while let Some(line) = child.progress() {' },
      { kind: 'add', text: '        if cancel.is_set() { child.kill()?; break; }' },
      { kind: 'add', text: '        ui.progress(line);' },
      { kind: 'add', text: '    }' },
      { kind: 'ctx', text: '    child.wait()' },
    ],
  },
  {
    sha: '3c9d1f8',
    subject: 'theme: switch live without a restart',
    author: 'vedang',
    when: '2 weeks ago',
    refs: [],
    graph: MAIN,
    file: 'src/theme.rs',
    lines: [
      { kind: 'hunk', text: '@@ -40,5 +40,8 @@ impl Theme {' },
      { kind: 'ctx', text: '    pub fn apply(&mut self, name: &str) {' },
      { kind: 'del', text: '        self.pending = Some(name.into());' },
      { kind: 'add', text: '        self.palette = Palette::load(name);' },
      { kind: 'add', text: '        self.dirty = true;' },
      { kind: 'ctx', text: '    }' },
    ],
  },
  {
    sha: 'b52a6e4',
    subject: 'compare: diff HEAD against any branch',
    author: 'vedang',
    when: '2 weeks ago',
    refs: [],
    graph: MAIN,
    file: 'src/compare.rs',
    lines: [
      { kind: 'hunk', text: '@@ -0,0 +1,8 @@' },
      { kind: 'add', text: 'pub fn compare(repo: &Repo, base: &Rev) -> Delta {' },
      { kind: 'add', text: '    let (ahead, behind) = repo.ahead_behind(base);' },
      { kind: 'add', text: '    Delta { ahead, behind, files: repo.diff_names(base) }' },
      { kind: 'add', text: '}' },
    ],
  },
  {
    sha: '8d6f0a1',
    subject: 'release: v0.1.0',
    author: 'vedang',
    when: '3 weeks ago',
    refs: ['v0.1.0'],
    graph: MAIN,
    file: 'Cargo.toml',
    lines: [
      { kind: 'hunk', text: '@@ -1,4 +1,4 @@' },
      { kind: 'ctx', text: '[package]' },
      { kind: 'ctx', text: 'name = "gitty"' },
      { kind: 'del', text: 'version = "0.0.9"' },
      { kind: 'add', text: 'version = "0.1.0"' },
    ],
  },
];

type ChangeFile = {
  path: string;
  status: 'M' | 'A' | 'D';
  lines: Line[];
};

const CHANGES: ChangeFile[] = [
  {
    path: 'src/history.rs',
    status: 'M',
    lines: [
      { kind: 'hunk', text: '@@ -148,6 +148,9 @@ impl History {' },
      { kind: 'ctx', text: '    pub fn walk(&mut self) {' },
      { kind: 'del', text: '        let _guard = self.write.lock();' },
      { kind: 'add', text: '        let mut chunk = Vec::new();' },
      { kind: 'add', text: '        // readers never wait on the walker' },
      { kind: 'ctx', text: '        while let Some(pos) = self.heap.pop() {' },
      { kind: 'ctx', text: '            chunk.push(self.decode(pos));' },
      { kind: 'ctx', text: '        }' },
    ],
  },
  {
    path: 'README.md',
    status: 'M',
    lines: [
      { kind: 'hunk', text: '@@ -12,6 +12,7 @@' },
      { kind: 'ctx', text: '- **History:** local and remote commits…' },
      { kind: 'add', text: '- **Compare:** `b` diffs HEAD against any branch.' },
    ],
  },
];

type Entry = {
  name: string;
  depth: number;
  dir?: boolean;
  closed?: boolean;
  status?: 'M' | 'A';
  // a folder with changes below it
  changed?: boolean;
  secret?: boolean;
  text?: string[];
};

const FILES: Entry[] = [
  { name: 'crates', depth: 0, dir: true, changed: true },
  { name: 'gitty', depth: 1, dir: true, changed: true },
  { name: 'src', depth: 2, dir: true, changed: true },
  {
    name: 'graph.rs',
    depth: 3,
    text: [
      '/// Lays out the commit graph the way lazygit does.',
      'pub struct Lanes {',
      '    slots: Vec<Option<ObjectId>>,',
      '}',
      '',
      'impl Lanes {',
      '    pub fn claim(&mut self, id: ObjectId) -> usize {',
      '        self.find(id).unwrap_or_else(|| self.open(id))',
      '    }',
      '}',
    ],
  },
  {
    name: 'history.rs',
    depth: 3,
    status: 'M',
    text: [
      'impl History {',
      '    pub fn walk(&mut self) {',
      '        let mut chunk = Vec::new();',
      '        // readers never wait on the walker',
      '        while let Some(pos) = self.heap.pop() {',
      '            chunk.push(self.decode(pos));',
      '        }',
      '    }',
      '}',
    ],
  },
  {
    name: 'Cargo.toml',
    depth: 2,
    text: ['[package]', 'name = "gitty-cli"', 'version = "0.2.0"'],
  },
  { name: 'herdr-plugin', depth: 0, dir: true, closed: true },
  { name: '.env', depth: 0, secret: true },
  {
    name: 'CHANGELOG.md',
    depth: 0,
    text: [
      '# Changelog',
      '',
      '## [0.2.0] - 2026-10-19',
      '',
      '### Added',
      '',
      '- A commit graph in History, shown by default.',
    ],
  },
  {
    name: 'README.md',
    depth: 0,
    status: 'M',
    text: ['# gitty', '', 'A fast terminal git client with the GitHub Desktop experience.'],
  },
];

const LANE_COLOR = ['var(--spot)', 'var(--st-done)'];
const LANE_X = (lane: number) => 7 + lane * 14;

function GraphCell(props: { graph: Graph }) {
  const g = () => props.graph;
  const color = (lane: number) => LANE_COLOR[lane % LANE_COLOR.length];
  const width = (lane: number) => (lane === 0 ? 2.5 : 1.5);
  return (
    <span class="gm-graph" aria-hidden="true">
      <svg>
        <For each={g().lines}>
          {([lane, from, to]) => (
            <line
              x1={LANE_X(lane)}
              x2={LANE_X(lane)}
              y1={`${from}%`}
              y2={`${to}%`}
              stroke={color(lane)}
              stroke-width={width(lane)}
            />
          )}
        </For>
        <Show when={g().join !== undefined}>
          <line
            x1={LANE_X(g().node)}
            x2={LANE_X(g().join!)}
            y1="50%"
            y2="50%"
            stroke={color(g().join!)}
            stroke-width={width(g().join!)}
          />
        </Show>
        <Show when={g().kind !== 'commit'}>
          <circle
            cx={LANE_X(g().node)}
            cy="50%"
            r="5.5"
            fill="var(--panel)"
            stroke={color(g().node)}
            stroke-width="1.5"
          />
        </Show>
        <circle cx={LANE_X(g().node)} cy="50%" r={g().kind === 'commit' ? 3.5 : 2.5} fill={color(g().node)} />
      </svg>
    </span>
  );
}

function Gutter(props: { line: Line; onClick?: () => void }) {
  const mark = () =>
    props.line.kind === 'add'
      ? props.line.staged
        ? '+'
        : ' '
      : props.line.kind === 'del'
        ? props.line.staged
          ? '-'
          : ' '
        : ' ';

  return (
    <span
      class={`gm-gut gm-${props.line.kind}`}
      onClick={props.onClick}
      classList={{ 'gm-on': props.line.kind !== 'ctx' && props.line.kind !== 'hunk' }}
    >
      {props.line.kind === 'hunk' ? '' : mark()}
    </span>
  );
}

export default function GittyMock() {
  const [tab, setTab] = createSignal<'changes' | 'history' | 'files'>('history');
  const [sel, setSel] = createSignal(0);
  const [fileIdx, setFileIdx] = createSignal(0);
  const [entryIdx, setEntryIdx] = createSignal(4);
  const [graph, setGraph] = createSignal(true);
  const [staged, setStaged] = createSignal<Record<string, boolean>>({});

  const commit = () => COMMITS[sel()];
  const change = () => CHANGES[fileIdx()];
  const entry = () => FILES[entryIdx()];

  const stageKey = (i: number) => `${fileIdx()}:${i}`;
  const isStaged = (i: number, fallback: boolean) => staged()[stageKey(i)] ?? fallback;

  const toggle = (i: number, fallback: boolean) =>
    setStaged((s) => ({ ...s, [stageKey(i)]: !isStaged(i, fallback) }));

  const stagedCount = () =>
    CHANGES.reduce(
      (n, f, fi) =>
        n +
        f.lines.filter((l, li) => (l.kind === 'add' || l.kind === 'del') && staged()[`${fi}:${li}`] === true)
          .length,
      0,
    );

  // branch labels take their lane's colour; tags stay plain
  const refColor = (c: Commit, r: string) =>
    graph() && !/^v\d/.test(r) ? LANE_COLOR[c.graph.node % LANE_COLOR.length] : undefined;

  return (
    <div class="gm">
      <div class="gm-title">
        <span class="gm-dot" />
        <span class="gm-prog">gitty — ~/Documents/personal/gitty</span>
        <span class="gm-tabs">
          <button
            class="gm-tab"
            classList={{ active: tab() === 'changes' }}
            onClick={() => setTab('changes')}
          >
            1 Changes
          </button>
          <button
            class="gm-tab"
            classList={{ active: tab() === 'history' }}
            onClick={() => setTab('history')}
          >
            2 History
          </button>
          <button class="gm-tab" classList={{ active: tab() === 'files' }} onClick={() => setTab('files')}>
            3 Files
          </button>
        </span>
      </div>

      <Switch>
        <Match when={tab() === 'changes'}>
          <div class="gm-body gm-changes">
            <div class="gm-files">
              <div class="gm-pane-hd">changes</div>
              <For each={CHANGES}>
                {(f, i) => (
                  <button
                    class="gm-file"
                    classList={{ active: fileIdx() === i() }}
                    onClick={() => setFileIdx(i())}
                  >
                    <span class={`gm-st gm-st-${f.status.toLowerCase()}`}>{f.status}</span>
                    {f.path}
                  </button>
                )}
              </For>
              <div class="gm-pane-ft">{stagedCount()} staged · Space stages a line</div>
            </div>
            <div class="gm-diff">
              <div class="gm-pane-hd">
                {change().path} <span class="gm-dim">working tree</span>
              </div>
              <div class="gm-lines">
                <For each={change().lines}>
                  {(l, i) => (
                    <div class="gm-line" classList={{ [`gm-${l.kind}`]: true }}>
                      <Gutter
                        line={
                          l.kind === 'hunk' || l.kind === 'ctx' ? l : { ...l, staged: isStaged(i(), false) }
                        }
                        onClick={l.kind === 'hunk' || l.kind === 'ctx' ? undefined : () => toggle(i(), false)}
                      />
                      <span class="gm-text">{l.text}</span>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>
        </Match>

        <Match when={tab() === 'history'}>
          <div class="gm-body gm-history">
            <div class="gm-list">
              <div class="gm-pane-hd">
                history <span class="gm-dim">↑1 ↓0</span>
              </div>
              <For each={COMMITS}>
                {(c, i) => (
                  <button class="gm-row" classList={{ active: sel() === i() }} onClick={() => setSel(i())}>
                    <Show when={graph()}>
                      <GraphCell graph={c.graph} />
                    </Show>
                    <span class="gm-sha">{c.sha}</span>
                    <span class="gm-subject">{c.subject}</span>
                    <span class="gm-when">{c.when}</span>
                    <span class="gm-badges">
                      <For each={c.refs}>
                        {(r) => (
                          <span
                            class="gm-ref"
                            style={{ color: refColor(c, r), 'border-color': refColor(c, r) }}
                          >
                            {r}
                          </span>
                        )}
                      </For>
                    </span>
                  </button>
                )}
              </For>
            </div>
            <div class="gm-detail">
              <div class="gm-pane-hd">
                {commit().sha}{' '}
                <span class="gm-dim">
                  {commit().author} · {commit().when}
                </span>
              </div>
              <div class="gm-filehd">{commit().file}</div>
              <div class="gm-lines">
                <For each={commit().lines}>
                  {(l) => (
                    <div class="gm-line" classList={{ [`gm-${l.kind}`]: true }}>
                      <Gutter
                        line={l.kind === 'hunk' || l.kind === 'ctx' ? l : { ...l, staged: l.staged ?? true }}
                      />
                      <span class="gm-text">{l.text}</span>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>
        </Match>

        <Match when={tab() === 'files'}>
          <div class="gm-body gm-changes">
            <div class="gm-files">
              <div class="gm-pane-hd">files</div>
              <For each={FILES}>
                {(f, i) => (
                  <button
                    class="gm-file gm-entry"
                    classList={{ active: entryIdx() === i(), 'gm-isdir': !!f.dir }}
                    style={{ 'padding-left': `${12 + f.depth * 14}px` }}
                    onClick={() => setEntryIdx(i())}
                  >
                    {f.dir ? (f.closed ? '▸ ' : '▾ ') : ''}
                    {f.name}
                    {f.dir ? '/' : ''}
                    <Show when={f.secret}>
                      <span class="gm-dim"> (secret)</span>
                    </Show>
                    <span class="gm-mark">
                      <Show when={f.status} fallback={f.changed ? '●' : ''}>
                        <span class={`gm-st gm-st-${f.status?.toLowerCase()}`}>{f.status}</span>
                      </Show>
                    </span>
                  </button>
                )}
              </For>
              <div class="gm-pane-ft">i hides ignored · secrets stay unread</div>
            </div>
            <div class="gm-diff">
              <div class="gm-pane-hd">
                {entry().name} <span class="gm-dim">read-only</span>
              </div>
              <div class="gm-lines">
                <Show
                  when={entry().text}
                  fallback={
                    <div class="gm-line gm-ctx">
                      <span class="gm-text">
                        {entry().secret
                          ? 'Looks like a secret: not read until you press v.'
                          : 'A directory: Enter opens it.'}
                      </span>
                    </div>
                  }
                >
                  <For each={entry().text}>
                    {(t, i) => (
                      <div class="gm-line gm-ctx">
                        <span class="gm-gut gm-num">{i() + 1}</span>
                        <span class="gm-text">{t}</span>
                      </div>
                    )}
                  </For>
                </Show>
              </div>
            </div>
          </div>
        </Match>
      </Switch>

      <div class="gm-status">
        <span class="gm-k">q</span> quit
        <span class="gm-k">f</span> fetch
        <span class="gm-k">P</span> push
        <span class="gm-k">/</span> search
        <span class="gm-k">b</span> compare
        <span class="gm-k">B</span> branches
        <button class="gm-kbtn" aria-pressed={graph()} onClick={() => setGraph((g) => !g)}>
          <span class="gm-k">L</span> graph
        </button>
        <span class="gm-k">?</span> keys
        <span class="gm-right">main ↑1 · 5 ms</span>
      </div>
    </div>
  );
}

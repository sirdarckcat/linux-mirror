import { createDbWorker } from "sql.js-httpvfs";

const workerUrl = new URL(
  "sql.js-httpvfs/dist/sqlite.worker.js",
  import.meta.url
);
const wasmUrl = new URL("sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);

const NUM_WORKERS = 6;

async function load(commit: string) {
  const workers = [];
  for (let i = 0; i < NUM_WORKERS; i++) {
    const worker = await createDbWorker(
      [
        {
          from: "jsonconfig",
          configUrl: "config.json?" + i + "-" + new Date().getTime()
        },
      ],
      workerUrl.toString(),
      wasmUrl.toString()
    );
    workers.push(worker);
  }

  let githubCommit = null;
  const getGithubCommit = async () => {
    try {
      const ret: any = await (await fetch(`https://api.github.com/repos/sirdarckcat/linux-1/commits/${encodeURI(commit)}`)).json();
      if (typeof ret.sha == "undefined" || typeof ret.commit == "undefined") {
        return { sha: commit, commit: { message: "[!] GitHub error: " + ret.message } }
      }
      return ret;
    } catch (e) {
      return { sha: commit, commit: { message: "[!] Fetch error: " + e } }
    }
  }

  if (commit.length < 40) {
    githubCommit = await getGithubCommit();
    if (!githubCommit.sha) throw new Error("Couldn't find commit " + commit);
    commit = githubCommit.sha;
  }

  if (commit.length < 4 || (commit.length < 7 && commit.length >= 4 && !confirm("Commit is very short - might return too many (or incorrect) results."))) {
    throw new Error("Commit is too short");
  }

  const promises = [
    githubCommit || getGithubCommit(),
    workers[0].db.query("SELECT tags FROM tags WHERE `commit` >= ? AND `commit` <= ? || 'g'", [commit, commit]),
    workers[0].db.query("SELECT upstream FROM upstream WHERE `commit` >= ? AND `commit` <= ? || 'g'", [commit, commit]),
    workers[1].db.query("SELECT tags, `commit` FROM tags WHERE `commit` IN (SELECT `commit` FROM upstream WHERE upstream >= ? AND upstream <= ? || 'g')", [commit, commit]),
    workers[0].db.query("SELECT fixes FROM fixes WHERE `commit` >= ? AND `commit` <= ? || 'g' AND LENGTH(fixes)>=4", [commit, commit]),
    workers[2].db.query("SELECT tags, `commit` FROM tags JOIN (SELECT substr(fixes, 0, instr(fixes, ' ')) trunc FROM fixes WHERE `commit` >= ? AND `commit` <= ? || 'g' AND LENGTH(fixes)>=4) ON (`commit`>trunc AND `commit`<trunc||'g')", [commit, commit]),
    workers[3].db.query("SELECT tags, `commit` FROM tags WHERE `commit` IN (SELECT `commit` FROM upstream JOIN (SELECT substr(fixes, 0, instr(fixes, ' ')) trunc FROM fixes WHERE `commit` >= ? AND `commit` <= ? || 'g' AND LENGTH(fixes)>=4) ON (upstream>trunc AND upstream<trunc||'g'))", [commit, commit]),
    workers[4].db.query("SELECT tags, `commit` FROM tags WHERE `commit` IN (SELECT `commit` FROM fixes WHERE LENGTH(fixes)>=4 AND fixes >= substr(?, 1, 4) AND fixes <= ? || 'g')", [commit, commit]),
    workers[5].db.query("SELECT reported_by, `commit` FROM reported_by WHERE (`commit` >= ? AND `commit` <= ? || 'g') OR `commit` IN (SELECT `commit` FROM fixes WHERE LENGTH(fixes)>=4 AND fixes >= substr(?, 1, 4) AND fixes <= ? || 'g')", [commit, commit, commit, commit]),
  ];
  if (location.href.match(/__PERF__/)) setInterval(() => console.log(promises), 100);
  const results = await Promise.all(promises);

  return {
    commit,
    "details": results.shift().commit.message.split("\n"),
    "the commit landed on upstream on": results.shift(),
    "the commit is a backport of": results.shift(),
    "the commit was backported to": results.shift(),
    "the commit fixes a bug introduced by": results.shift(),
    "the buggy commit landed on upstream on": results.shift(),
    "the buggy commit was backported to": results.shift(),
    "the commit introduced a bug fixed by": results.shift(),
    "syzkaller reference for the commit and the fix commit": results.shift()
  };
}

const doit = async function () {
  const output = document.getElementById('output') || document.body;
  try {
    let commit = location.hash.slice(1);
    output.textContent = 'Loading ' + commit;
    document.body.className = 'loading';
    if (!commit) {
      location.hash = "23f57406";
      location.reload();
      return;
    }
    const result = await load(commit);
    output.textContent = JSON.stringify(result, null, 1);
    document.body.className = 'done';
  } catch (e) {
    output.textContent = String(e);
    document.body.className = 'error';
  }
};

onhashchange = doit;
doit();

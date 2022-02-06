import {createDbWorker} from "sql.js-httpvfs";

const workerUrl = new URL(
  "sql.js-httpvfs/dist/sqlite.worker.js",
  import.meta.url
);
const wasmUrl = new URL("sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);

async function load() {
  const worker = await createDbWorker(
    [
      {
        from: "jsonconfig",
        configUrl: "config.json?" + new Date().getTime()
      },
    ],
    workerUrl.toString(),
    wasmUrl.toString()
  );

  let commit = location.hash.slice(1);

  if(!commit) {
    location.hash = "e1b3fa7b6471e1b2f4c7573711e7f8ee2e9f3dc3";
    location.reload();
    return;
  }

  let githubCommit = null;
  const getGithubCommit = async ()=>await (await fetch(`https://api.github.com/repos/sirdarckcat/linux-1/commits/${commit}`)).json();

  if(commit.length < 40) {
    githubCommit = await getGithubCommit();
    if (!githubCommit.sha) throw new Error("Couldn't find commit " + commit);
    commit = githubCommit.sha;
  }

  const results = await Promise.all([
    githubCommit || getGithubCommit (),
    worker.db.query("SELECT tags FROM tags WHERE `commit` = ?", [commit]),
    worker.db.query("SELECT upstream FROM upstream WHERE `commit` = ?", [commit]),
    worker.db.query("SELECT tags, `commit` FROM tags WHERE `commit` IN (SELECT `commit` FROM upstream WHERE upstream = ?)", [commit]),
    worker.db.query("SELECT fixes FROM fixes WHERE `commit` = ? AND LENGTH(fixes)>=4", [commit]),
    worker.db.query("SELECT tags, `commit` FROM tags JOIN (SELECT substr(fixes, 0, instr(fixes, ' ')) trunc FROM fixes WHERE `commit` = ? AND LENGTH(fixes)>=4) ON (`commit`>trunc AND `commit`<trunc||'g')", [commit]),
    worker.db.query("SELECT tags, `commit` FROM tags WHERE `commit` IN (SELECT `commit` FROM upstream JOIN (SELECT substr(fixes, 0, instr(fixes, ' ')) trunc FROM fixes WHERE `commit` = ? AND LENGTH(fixes)>=4) ON (upstream>trunc AND upstream<trunc||'g'))", [commit]),
    worker.db.query("SELECT tags, `commit` FROM tags WHERE `commit` IN (SELECT `commit` FROM fixes WHERE LENGTH(fixes)>=4 AND fixes >= substr(?, 1, 4) AND fixes <= ?)", [commit, commit]),
    worker.db.query("SELECT reported_by, `commit` FROM reported_by WHERE `commit` = ? OR `commit` IN (SELECT `commit` FROM fixes WHERE LENGTH(fixes)>=4 AND fixes >= substr(?, 1, 4) AND fixes <= ?)", [commit, commit, commit]),
  ]);

  const result = {
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

  document.body.style.whiteSpace = 'pre-wrap';
  document.body.textContent = JSON.stringify(result, null, 1);
}

(async function () {
  try {
    load();
  } catch(e) {
    alert(e);
  }
})();

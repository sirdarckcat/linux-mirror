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

  const commit = location.hash.slice(1);

  if(!commit) {
    location.hash = "e1b3fa7b6471e1b2f4c7573711e7f8ee2e9f3dc3";
    location.reload();
    return;
  }

  const results = await Promise.all([
    worker.db.query("SELECT tags FROM tags WHERE `commit` = ?", [commit]),
    worker.db.query("SELECT tags, `commit` FROM tags WHERE `commit` IN (SELECT `commit` FROM upstream WHERE upstream = ?)", [commit]),
    worker.db.query("SELECT fixes FROM fixes WHERE `commit` = ?", [commit]),
    worker.db.query("SELECT tags, `commit` FROM tags JOIN (SELECT substr(fixes, 0, instr(fixes, ' ')) trunc FROM fixes WHERE `commit` = ? AND LENGTH(fixes)>4) ON (`commit`>trunc AND `commit`<trunc||'g')", [commit]),
    worker.db.query("SELECT tags, `commit` FROM tags WHERE `commit` IN (SELECT `commit` FROM upstream JOIN (SELECT substr(fixes, 0, instr(fixes, ' ')) trunc FROM fixes WHERE `commit` = ? AND LENGTH(fixes)>4) ON (upstream>trunc AND upstream<trunc||'g'))", [commit]),
    worker.db.query("SELECT tags, `commit` FROM tags WHERE `commit` IN (SELECT `commit` FROM fixes WHERE LENGTH(fixes)>4 AND fixes >= substr(?, 1, 4) AND fixes <= ?)", [commit, commit]),
    worker.db.query("SELECT reported_by, `commit` FROM reported_by WHERE `commit` = ? OR `commit` IN (SELECT `commit` FROM fixes WHERE LENGTH(fixes)>4 AND fixes >= substr(?, 1, 4) AND fixes <= ?)", [commit, commit, commit]),
  ]);

  const result = {
    commit,
    "the commit landed on upstream on": results[0],
    "the commit was backported to": results[1],
    "the commit fixes a bug introduced by": results[2],
    "the buggy commit landed on upstream on": results[3],
    "the buggy commit was backported to": results[4],
    "the commit introduced a bug fixed by": results[5],
    "syzkaller reference for the commit and the fix commit": results[6]
  };

  document.body.style.whiteSpace = 'pre-wrap';
  document.body.textContent = JSON.stringify(result, null, 1);
}

load();

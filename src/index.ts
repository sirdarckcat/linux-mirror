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
        configUrl: "config.json"
      },
    ],
    workerUrl.toString(),
    wasmUrl.toString()
  );

  const commit = location.hash.slice(1) || 'e1b3fa7b6471e1b2f4c7573711e7f8ee2e9f3dc3';

  const result = {
    commit,
    "commit landed on upstream on": await worker.db.query("SELECT tags FROM tags WHERE `commit` = ?", [commit]),
    "commit was backported to": await worker.db.query("SELECT tags FROM tags WHERE `commit` IN (SELECT `commit` FROM upstream WHERE upstream = ?)", [commit]),
    "commit fixes bug introduced by": await worker.db.query("SELECT fixes FROM fixes WHERE `commit` = ?", [commit]),
    "buggy commit landed on upstream on": await worker.db.query("SELECT tags FROM tags JOIN (SELECT substr(fixes, 0, instr(fixes, ' ')) trunc FROM fixes WHERE `commit` = ?) ON (`commit`>trunc AND `commit`<trunc||'g')", [commit]),
    "buggy commit was backported to": await worker.db.query("SELECT tags FROM tags WHERE `commit` IN (SELECT `commit` FROM upstream JOIN (SELECT substr(fixes, 0, instr(fixes, ' ')) trunc FROM fixes WHERE `commit` = ?) ON (upstream>trunc AND upstream<trunc||'g'))", [commit]),
    "syzkaller reporter email": await worker.db.query("SELECT reported_by FROM reported_by WHERE `commit` = ?", [commit])
  };

  document.body.style.whiteSpace = 'pre-wrap';
  document.body.textContent = JSON.stringify({...result}, null, 1);
}

load();

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

  const commit = location.hash.slice(1) || '618f003199c6188e01472b03cdbba227f1dc5f24';

  const result = {
    tags: await worker.db.query("SELECT tags FROM tags WHERE `commit` = ?", [commit]),
    reported_by: await worker.db.query("SELECT reported_by FROM reported_by WHERE `commit` = ?", [commit]),
    fixes: await worker.db.query("SELECT fixes FROM fixes WHERE `commit` = ?", [commit]),
    backports: await worker.db.query("SELECT `commit` FROM upstream WHERE upstream = ?", [commit]),
  };

  document.body.textContent = JSON.stringify(result);
}

load();

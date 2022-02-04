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

  const result = await worker.db.query("select reported_by from reported_by where `commit`='618f003199c6188e01472b03cdbba227f1dc5f24'");

  document.body.textContent = JSON.stringify(result);
}

load();

import { createDbWorker, WorkerHttpvfs } from "sql.js-httpvfs";

const workerUrl = new URL(
  "sql.js-httpvfs/dist/sqlite.worker.js",
  import.meta.url
);
const wasmUrl = new URL("sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);

class LinuxMirror {
  NUM_WORKERS = 6;
  CONFIG = "https://linux-mirror-db.storage.googleapis.com/config.json";
  workers: (WorkerHttpvfs[] | null) = null;
  initialConfig: (Promise<Response> | null) = null;

  public async init() {
    this.initialConfig = fetch(this.CONFIG);
    const workerPromises = [];
    for (let i = 0; i < this.NUM_WORKERS; i++) {
      const worker = createDbWorker(
        [
          {
            from: "jsonconfig",
            configUrl: this.CONFIG
          },
        ],
        workerUrl.toString(),
        wasmUrl.toString()
      );
      workerPromises.push(worker);
    }
    this.workers = await Promise.all(workerPromises);
    window.onhashchange = () => this.doit();
    this.doit();
  }

  private async getGithubCommit(commit: string) {
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

  public async load(commit: string) {
    if (!this.workers) {
      throw new Error("Workers are not initialized.");
    }
    let cveResults: any = [], cve = "";
    if (commit.match(/^CVE-\d+-\d+$/)) {
      cve = commit;
      cveResults = (await this.workers[5].db.query("SELECT `commit` FROM cve WHERE cve = ?", [commit]));
      if (!cveResults) {
        throw new Error('No commit exists for this CVE');
      }
      commit = cveResults[0].commit;
    }

    let githubCommit = null;

    if (commit.length < 40) {
      githubCommit = await this.getGithubCommit(commit);
      if (!githubCommit.sha) throw new Error("Couldn't find commit " + commit);
      commit = githubCommit.sha;
    }

    if (commit.length < 4 || (commit.length < 7 && commit.length >= 4 && !confirm("Commit is very short - might return too many (or incorrect) results."))) {
      throw new Error("Commit is too short");
    }

    const promises = [
      githubCommit || this.getGithubCommit(commit),
      this.workers[0].db.query("SELECT tags FROM tags WHERE `commit` >= ? AND `commit` <= ? || 'g'", [commit, commit]),
      this.workers[0].db.query("SELECT upstream FROM upstream WHERE `commit` >= ? AND `commit` <= ? || 'g'", [commit, commit]),
      this.workers[1].db.query("SELECT tags, `commit` FROM tags WHERE `commit` IN (SELECT `commit` FROM upstream WHERE upstream >= ? AND upstream <= ? || 'g')", [commit, commit]),
      this.workers[0].db.query("SELECT fixes FROM fixes WHERE `commit` >= ? AND `commit` <= ? || 'g' AND LENGTH(fixes)>=4", [commit, commit]),
      this.workers[2].db.query("SELECT tags, `commit` FROM tags JOIN (SELECT substr(fixes, 0, instr(fixes, ' ')) trunc FROM fixes WHERE `commit` >= ? AND `commit` <= ? || 'g' AND LENGTH(fixes)>=4) ON (`commit`>trunc AND `commit`<trunc||'g')", [commit, commit]),
      this.workers[3].db.query("SELECT tags, `commit` FROM tags WHERE `commit` IN (SELECT `commit` FROM upstream JOIN (SELECT substr(fixes, 0, instr(fixes, ' ')) trunc FROM fixes WHERE `commit` >= ? AND `commit` <= ? || 'g' AND LENGTH(fixes)>=4) ON (upstream>trunc AND upstream<trunc||'g'))", [commit, commit]),
      this.workers[4].db.query("SELECT tags, `commit` FROM tags WHERE `commit` IN (SELECT `commit` FROM fixes WHERE LENGTH(fixes)>=4 AND fixes >= substr(?, 1, 4) AND fixes <= ? || 'g' AND SUBSTR(fixes, 0, instr(fixes, ' ')) = SUBSTR(?, 0, instr(fixes, ' ')))", [commit, commit, commit]),
      this.workers[5].db.query("SELECT reported_by, `commit` FROM reported_by WHERE (`commit` >= ? AND `commit` <= ? || 'g') OR `commit` IN (SELECT `commit` FROM fixes WHERE LENGTH(fixes)>=4 AND fixes >= substr(?, 1, 4) AND fixes <= ? || 'g' AND SUBSTR(fixes, 0, instr(fixes, ' ')) = SUBSTR(?, 0, instr(fixes, ' ')))", [commit, commit, commit, commit, commit]),
      this.workers[5].db.query("SELECT cve FROM cve WHERE (`commit` >= ? AND `commit` <= ? || 'g') OR `commit` IN (SELECT `commit` FROM fixes WHERE LENGTH(fixes)>=4 AND fixes >= substr(?, 1, 4) AND fixes <= ? || 'g' AND SUBSTR(fixes, 0, instr(fixes, ' ')) = SUBSTR(?, 0, instr(fixes, ' ')))", [commit, commit, commit, commit, commit]),
    ];
    let results;
    if (location.href.match(/__PERF__/)) {
      console.time("promise perf");
      const perfInterval = setInterval(() => console.log(...promises), 100);
      results = await Promise.all(promises.map(async (promise, i) => {
        const ret = await promise;
        console.timeLog("promise perf");
        console.log(i);
        return ret;
      }));
      clearInterval(perfInterval);
      console.timeEnd("promise perf");
    } else {
      results = await Promise.all(promises);
    }

    return {
      ...(cve?{cve, "commits associated with cve": cveResults}:{}),
      commit,
      "details": results.shift().commit.message.split("\n"),
      "the commit landed on upstream on": results.shift(),
      "the commit is a backport of": results.shift(),
      "the commit was backported to": results.shift(),
      "the commit fixes a bug introduced by": results.shift(),
      "the buggy commit landed on upstream on": results.shift(),
      "the buggy commit was backported to": results.shift(),
      "the commit introduced a bug fixed by": results.shift(),
      "syzkaller reference for the commit and the fix commit": results.shift(),
      "cve identifier for the commit and the fix commit": results.shift(),
    };
  }

  public format(pre: Element) {
    const allRanges: Record<string, Range[]> = {};
    const scanNodes = (regexp: RegExp, tag: string) => {
      const ranges = allRanges[tag] = allRanges[tag] || [];
      [...pre.childNodes].forEach(node =>
        node.nodeName == "#text" &&
        node.nodeValue &&
        node.nodeValue.replace(
          regexp,
          (match, offset) => {
            ranges.unshift(document.createRange());
            ranges[0].setStart(node, offset);
            ranges[0].setEnd(node, offset + match.length);
            return match;
          }));
    };
    scanNodes(/\b(?:[0-9a-f]{7,40}|CVE-\d+-\d+)\b/g, 'a');
    Object.entries(allRanges).forEach(([tag, ranges]) =>
      ranges.forEach(range =>
        range.surroundContents(document.createElement(tag))));
    [...pre.querySelectorAll('a')].forEach(a => {
      a.href = '#' + a.textContent;
    });
  }

  public async doit() {
    const output = document.getElementById('output') || document.body;
    try {
      let commit = location.hash.slice(1);
      output.textContent = 'Loading ' + commit;
      document.body.className = 'loading';
      if (!commit) {
        location.hash = "73f156a";
        location.reload();
        return;
      }
      const result = await this.load(commit);
      output.textContent = JSON.stringify(result, null, 1);
      this.format(output);
      document.body.className = 'done';
    } catch (e) {
      output.textContent = String(e);
      document.body.className = 'error';
      if (this.initialConfig) {
        const latestConfig = await fetch(this.CONFIG, { cache: "reload" });
        const initialConfig = await this.initialConfig;
        if ((await latestConfig.json()).databaseLengthBytes != (await initialConfig.json()).databaseLengthBytes) {
          if (confirm("Database has been updated, reload?")) {
            location.reload();
          }
        }
      }
    }
  }
}

(new LinuxMirror()).init();

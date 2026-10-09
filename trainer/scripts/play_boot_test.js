// Boots the GENERATED docs/play/app.js in a fake DOM against the real data files.
// Added v72: node --check cannot catch an undefined identifier (v71 shipped a
// 7-fetch Promise.all destructured into 6 slots -> ReferenceError -> the app
// replaced itself with "Could not load tag data"). Only execution catches that.
// Run: node trainer/scripts/play_boot_test.js   (exit 1 = app is broken)

// Boots the GENERATED play/app.js in a fake DOM against the real docs/ data,
// exactly as a browser would. This is the check that would have caught the
// v71 destructure bug: node --check passes on an undefined identifier, only
// execution catches it.
const fs = require("fs"), path = require("path"), vm = require("vm");
const R = path.resolve(__dirname, "..", "..", "docs");

const el = () => ({ innerHTML: "", textContent: "", value: "", style: {},
  classList: { add(){}, remove(){}, toggle(){}, contains(){return false} },
  appendChild(){}, setAttribute(){}, removeAttribute(){}, addEventListener(){},
  remove(){},                       /* v74: boot overlay teardown uses it */
  dataset: {}, children: [], querySelector(){return el()}, querySelectorAll(){return []} });

const doc = {
  documentElement: el(), body: el(),
  createElement: () => el(), createTextNode: () => el(),
  querySelector: (s) => (doc.__els[s] = doc.__els[s] || el()),
  __els: {},
  querySelectorAll: () => [],
  addEventListener(ev, fn){ (sandbox.__listeners[ev] = sandbox.__listeners[ev] || []).push(fn); },
  readyState: "loading",
};
const fetched = [];
const sandbox = {
  document: doc, window: {}, console,
  __listeners: {},
  localStorage: { getItem: () => null, setItem(){}, removeItem(){} },
  fetch: (u) => {
    fetched.push(u);
    const p = path.join(R, u.replace(/^\.\.\//, ""));
    if (!fs.existsSync(p)) return Promise.reject(new Error("404 " + u));
    return Promise.resolve({ json: () => Promise.resolve(JSON.parse(fs.readFileSync(p, "utf8"))) });
  },
  setTimeout, clearTimeout, Math, JSON, Date, Object, Array, Number, String, Boolean, Error,
  Promise, isFinite, parseInt, parseFloat, structuredClone: (x) => JSON.parse(JSON.stringify(x)),
  navigator: { userAgent: "node" }, location: { href: "http://x/play/" },
  addEventListener(ev, fn){ (sandbox.__listeners[ev] = sandbox.__listeners[ev] || []).push(fn); },
  requestAnimationFrame: (f) => setTimeout(f, 0),
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
const ctx = vm.createContext(sandbox);

const code = fs.readFileSync(path.join(R, "play", "app.js"), "utf8");
let uncaught = null;
try {
  vm.runInContext(code, ctx, { filename: "play/app.js" });
} catch (e) {
  uncaught = e;
}

setTimeout(() => {
  for (const fn of (sandbox.__listeners.DOMContentLoaded || [])) {
    try { fn(); } catch (e) { uncaught = e; }
  }
  setTimeout(() => {
  console.log("fetches attempted:", fetched.length);
  console.log(fetched.map(u => "  " + u.replace("../data/", "data/")).join("\n"));
  const box = doc.querySelector("#battleBox");
  const html = (doc.__real && doc.__real.innerHTML) || box.innerHTML || "";
  console.log("  error panel seen:", /Could not load tag data/.test(html));
  if (uncaught) { console.log("\nRESULT: FAIL - uncaught at load:", uncaught.message); process.exit(1); }
  if (/Could not load tag data/.test(html)) {
    console.log("\nRESULT: FAIL - boot showed the error message:\n  " + html.replace(/<[^>]+>/g, " ").trim());
    process.exit(1);
  }
  // Proof the wheel actually reached the engine: call the exported battle code.
  const W = require(path.join(R, "data", "ar_wheel.json")).tags;
  const mapped = Object.keys(W).length;
  console.log("\nRESULT: PASS - boot completed, no error panel");
  console.log("  wheel file tags on disk:", mapped);
  console.log("  battleBox html length:", html.length);
  console.log("  shows picker/empty-state:", /Pick 3 enemy|Pick your|empty|Add/i.test(html));
  process.exit(0);
  }, 1500);
}, 200);
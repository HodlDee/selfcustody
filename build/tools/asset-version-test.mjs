/* ASSET_VERSION must describe the assets, not the checkout.

   render.mjs hashes four CSS and JS files to derive the ?v= query stamped on
   every page. It used to hash the raw working-tree bytes, so a clone made with
   core.autocrlf=true produced a different digest from the same commit -- and
   72 generated HTML files then differed on nothing but that query string,
   against a CI job whose whole purpose is to fail when generated output does
   not match its source.

   The reason this survived is worth recording: an LF machine builds clean
   whichever way the hash is computed, so no amount of rebuilding locally finds
   it. It took someone checking out the repository a different way.

   .gitattributes now pins those files to LF, which stops git from ever handing
   the build different bytes. This checks the other half -- that the digest
   itself does not care -- because the attributes only bind inside a git
   checkout, and a zip download or an editor that rewrote the endings is
   outside one. */

import { mkdtempSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { assetDigest } from './asset-version.mjs';

let failures = 0;
const ok = (name, condition, detail = '') => {
  console.log(`  ${condition ? 'ok  ' : 'FAIL'} ${name}${condition || !detail ? '' : `\n         ${detail}`}`);
  if (!condition) failures++;
};

/* Real asset content rather than a synthetic string, so the test exercises the
   sizes and character mix the build actually hashes. */
const REAL = [
  'docs/assets/css/site-refresh.css',
  'docs/assets/js/site-refresh.js'
].map(f => readFileSync(f, 'utf8'));

const root = mkdtempSync(join(tmpdir(), 'assetver-'));
const write = (name, text) => {
  const path = join(root, name);
  writeFileSync(path, text);
  return path;
};

try {
  console.log('asset version');

  const lf = REAL.map((text, i) => write(`lf-${i}`, text.replace(/\r\n?/g, '\n')));
  const crlf = REAL.map((text, i) => write(`crlf-${i}`, text.replace(/\r\n?/g, '\n').replace(/\n/g, '\r\n')));
  const cr = REAL.map((text, i) => write(`cr-${i}`, text.replace(/\r\n?/g, '\n').replace(/\n/g, '\r')));

  ok('a CRLF checkout hashes to the same version as an LF one',
    assetDigest(lf) === assetDigest(crlf),
    `${assetDigest(lf)} vs ${assetDigest(crlf)}`);

  /* Old Mac line endings are not a checkout git produces, but the point of
     normalising in the hash rather than only in .gitattributes is that the
     digest stops depending on how the file arrived. */
  ok('a lone-CR file hashes the same too',
    assetDigest(lf) === assetDigest(cr),
    `${assetDigest(lf)} vs ${assetDigest(cr)}`);

  /* The failure mode of over-normalising: a hash that ignores so much it stops
     noticing the changes it exists to notice. */
  const edited = [write('edited-0', REAL[0].replace(/\r\n?/g, '\n') + '\n.sc-test{color:red}\n'), lf[1]];
  ok('an actual CSS change still changes the version',
    assetDigest(lf) !== assetDigest(edited));

  ok('reverting that change restores the original version',
    assetDigest([write('reverted-0', REAL[0].replace(/\r\n?/g, '\n')), lf[1]]) === assetDigest(lf));

  /* Order is part of the contract -- VERSIONED_ASSETS is written out by hand
     precisely so the digest is stable and not dependent on directory order. */
  ok('the digest depends on the order of the list',
    assetDigest(lf) !== assetDigest([...lf].reverse()));

  ok('the digest is the documented shape',
    /^[0-9a-f]{12}$/.test(assetDigest(lf)), assetDigest(lf));
} finally {
  rmSync(root, { recursive: true, force: true });
}

if (failures) {
  console.error(`\n  ABORT: ${failures} asset version case(s) failed`);
  process.exit(1);
}
console.log('asset version: 6 cases pass -- line endings do not move the digest, real changes do');

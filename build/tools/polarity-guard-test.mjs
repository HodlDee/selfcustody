/* The polarity guard's own behaviour, exercised against fixtures.

   assert-polarity.mjs decides whether a sentence claims a capability, and that
   decision is a pile of regular expressions. Regular expressions are exactly
   the kind of code that goes on passing after it has stopped working: tighten
   a pattern to silence a false positive and the guard can quietly stop
   matching anything at all, while the build keeps printing "no
   contradictions" and everyone believes it.

   So the cases below plant contradictions into a copy of the real docs/ and
   require the guard to find them, plant the same claims negated and require it
   not to, and take away the evidence to check that the guard gets louder
   rather than quieter when it can no longer see. Each one failed at some point
   during the guard's development, which is why it is here. */

import { mkdtempSync, cpSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkPolarity } from './assert-polarity.mjs';

let failures = 0;
const ok = (name, condition, detail = '') => {
  console.log(`  ${condition ? 'ok  ' : 'FAIL'} ${name}${condition || !detail ? '' : `\n         ${detail}`}`);
  if (!condition) failures++;
};

/* A throwaway copy of the built site, so a fixture cannot touch the real one.
   The guard reads docs/ relative to a root, and that parameter exists for this
   test and nothing else. */
function fixture(edit) {
  const root = mkdtempSync(join(tmpdir(), 'polarity-'));
  cpSync('docs', join(root, 'docs'), { recursive: true });
  const at = p => join(root, 'docs', p);
  const rewrite = (p, from, to) => {
    const before = readFileSync(at(p), 'utf8');
    const after = typeof from === 'string' ? before.replace(from, to) : before.replace(from, to);
    if (after === before) throw new Error(`fixture edit found nothing to change in ${p}`);
    writeFileSync(at(p), after);
  };
  try {
    edit({ rewrite, at });
    return checkPolarity(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

/* Where a contradiction is planted. A guide body, because that is where the
   real risk lives: the matrix and the guide are edited months apart. */
const GUIDE = 'guides/ledger-setup.html';
const plant = sentence => ({ rewrite }) =>
  rewrite(GUIDE, '<div class="sc-article">', `<div class="sc-article"><p>${sentence}</p>`);

console.log('polarity guard');

/* The site as committed. If this ever fails, the guard is reporting a real
   contradiction and the rest of this file is beside the point. */
{
  const r = checkPolarity('.');
  ok('the site as committed has no contradictions and no stale acknowledgements',
    r.conflicts.length === 0 && r.stale.length === 0 && r.structural.length === 0,
    [...r.conflicts.map(c => `${c.product} / ${c.feature}: ${c.sentence}`), ...r.stale].join('\n         '));
  ok('the guard is actually checking something',
    r.checked > 50 && r.sentences > 1000,
    `${r.checked} dashes against ${r.sentences} sentences`);
}

/* Devices.html dashes Ledger for both an air-gapped path and camera QR. */
{
  const r = fixture(plant('The Ledger Flex supports air-gapped signing over its camera.'));
  ok('a planted claim is found',
    r.conflicts.some(c => c.product === 'Ledger' && c.feature === 'Fully air-gapped signing path'));
  ok('a sentence claiming two dashed capabilities is reported for both',
    r.conflicts.filter(c => c.product === 'Ledger').length >= 2,
    r.conflicts.map(c => c.feature).join(', '));
}

/* The library states limitations far more often than capabilities, so a guard
   that cannot read a negation reports the site's own corrections as errors. */
{
  const r = fixture(plant('The Ledger Flex does not support air-gapped signing, and has no camera.'));
  ok('the same claim negated is not a contradiction',
    r.conflicts.length === 0, r.conflicts.map(c => c.sentence).join(' | '));
}
{
  const r = fixture(plant('Ledger devices connect over USB rather than an air-gapped path.'));
  ok('"rather than" is read as a denial',
    r.conflicts.length === 0, r.conflicts.map(c => c.sentence).join(' | '));
}

/* A matrix column is a current product; the guides discuss superseded ones.
   Foundation's earlier Passport really was bitcoin-only, against a column that
   is about Passport Prime, which is not. */
{
  const r = fixture(plant('The earlier bitcoin-only Passport firmware is a different trade worth looking at.'));
  ok('a sentence about a superseded model is not a claim about the current one',
    !r.conflicts.some(c => c.product === 'Foundation Passport'),
    r.conflicts.map(c => c.sentence).join(' | '));
}

/* The failure that shaped the matcher. This sentence is real, it names seven
   products and three connection methods, and every pairing in it is correct.
   An earlier version of the guard reported it six times. */
{
  const r = fixture(plant(
    'Add each device and choose how it connects: USB for Trezor, Ledger, BitBox02 and similar; ' +
    'microSD file import for COLDCARD; QR for SeedSigner, Keystone, and Passport.'));
  ok('a list pairing products with methods is not read as a claim about each of them',
    r.conflicts.length === 0, r.conflicts.map(c => `${c.product}/${c.feature}`).join(', '));
}

/* An acknowledgement is a judgement about a specific sentence. If the sentence
   moves, the judgement has to be made again rather than inherited. */
{
  const r = fixture(({ rewrite }) => rewrite('guides/bitbox02-setup.html',
    'a backup written to a microSD card in a few seconds',
    'a backup written to a microSD card in seconds'));
  ok('editing an acknowledged sentence sends it back for review',
    r.stale.length >= 1 && r.conflicts.length >= 1,
    `${r.stale.length} stale, ${r.conflicts.length} conflicts`);
}
{
  const r = fixture(({ rewrite }) => rewrite('guides/bitbox02-setup.html',
    /The BitBox02 does that too,[^.]*\./, 'The BitBox02 is quick to set up.'));
  ok('deleting an acknowledged sentence reports the acknowledgement as stale',
    r.stale.length >= 1, `${r.stale.length} stale`);
}

/* The failure mode a guard is least allowed to have. If the matrices stop
   being findable, every dash disappears and the check passes on nothing --
   so losing the evidence has to be an abort rather than a clean run. */
{
  const r = fixture(({ rewrite }) =>
    rewrite('software.html', /sc-feature-matrix/g, 'sc-feature-grid'));
  ok('a page that loses its matrix is a structural failure, not a pass',
    r.structural.length >= 1, JSON.stringify(r.structural));
}

if (failures) {
  console.error(`\n  ABORT: ${failures} polarity guard case(s) failed`);
  process.exit(1);
}
console.log('polarity guard: 11 cases pass -- planted claims found, denials and list sentences ignored, missing evidence fatal');

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

/* Two clauses of opposite polarity in one sentence. The library writes like
   this constantly, and getting it wrong in either direction is expensive: miss
   the claim and the guard is decorative, flag the denial and it is noise. */
{
  const r = fixture(plant('The COLDCARD has no camera, and the Blockstream Jade Plus supports NFC.'));
  ok('a claim in the second clause is found despite a denial in the first',
    r.conflicts.some(c => c.product === 'Blockstream Jade Plus' && c.feature === 'NFC'),
    r.conflicts.map(c => `${c.product}/${c.feature}`).join(', '));
}
{
  const r = fixture(plant('The Ledger Flex connects over USB and has no air-gapped signing path.'));
  ok('a denial in the second clause is not read as a claim',
    r.conflicts.length === 0, r.conflicts.map(c => c.sentence).join(' | '));
}

/* A known miss, asserted as a miss.

   "not only X" is an affirmation wearing a negation, and the denial list reads
   the "not". Erring this way is the deliberate choice -- the library states
   limitations far more often than capabilities -- but an undocumented gap
   becomes a false sense of coverage, so it is pinned here. If someone later
   teaches the matcher this construction, this case fails and tells them the
   guard got better rather than leaving them wondering what broke. */
{
  const r = fixture(plant('The Ledger Flex is not only a USB device — it also supports air-gapped signing.'));
  ok('"not only" is a known miss, and still a miss',
    r.conflicts.length === 0,
    'if this now fails, the matcher improved: update the limits comment in assert-polarity.mjs');
}

/* Partial loss of the evidence, which is the failure this guard was found to
   have. Losing a whole table was noticed; losing a row, a column or the class
   that marks a cell was not, and each one silently shrank what was checked
   while the build reported success. */
{
  const r = fixture(({ rewrite }) =>
    rewrite('software.html', /sc-feature-matrix/g, 'sc-feature-grid'));
  ok('a page that loses its matrix is a structural failure, not a pass',
    r.structural.length >= 1, JSON.stringify(r.structural));
}
{
  const r = fixture(({ rewrite }) => rewrite('devices.html',
    /<tr>\s*<th scope="row">Camera-based QR signing<\/th>[\s\S]*?<\/tr>/, ''));
  ok('deleting one feature row is a structural failure',
    r.structural.some(s => /feature rows/.test(s)), JSON.stringify(r.structural));
}
{
  const r = fixture(({ rewrite }) => rewrite('devices.html',
    /<th scope="col">Krux<\/th>/, ''));
  ok('deleting one product column is a structural failure',
    r.structural.some(s => /products/.test(s)), JSON.stringify(r.structural));
}
{
  const r = fixture(({ rewrite }) => rewrite('devices.html',
    /sc-matrix-no(?=["\s])/g, 'sc-matrix-absent'));
  ok('a mark the guard cannot recognise is a structural failure, not zero dashes',
    r.structural.some(s => /no recognisable mark/.test(s)),
    `${r.dashes} dashes, ${r.structural.length} structural`);
}
{
  /* The renamed-class case above went unnoticed by the first implementation
     for an accidental reason: its pattern matched "no" as a prefix of "none".
     Anchoring fixed that, and this pins the anchoring. */
  const r = fixture(({ rewrite }) => rewrite('devices.html',
    /sc-matrix-no(?=["\s])/g, 'sc-matrix-none'));
  ok('a mark renamed to something starting with the old name is caught too',
    r.structural.some(s => /no recognisable mark/.test(s)),
    `${r.dashes} dashes, ${r.structural.length} structural`);
}

/* The prose side of the same failure, and the one that survived the first
   hardening pass. Review added a second class to one guide's article div -- no
   visible change, the kind of edit made while styling a page -- and the guard
   read none of that guide, missed a contradiction planted in it, reported no
   structural problem and passed all nineteen cases then in this file.

   A harmless class must not remove a guide from review, and a guide that
   genuinely cannot be read must say so. */
{
  const r = fixture(({ rewrite }) => {
    rewrite('guides/jade-setup.html', '<div class="sc-article">',
      '<div class="sc-article sc-article-wide"><p>Blockstream Jade Plus supports NFC.</p>');
  });
  ok('an extra class on the article div does not hide the guide',
    r.conflicts.some(c => c.product === 'Blockstream Jade Plus' && c.feature === 'NFC'),
    `${r.conflicts.length} conflicts, ${r.sentences} sentences`);
}
{
  /* The class token has to be matched as a token. sc-article-num appears all
     over these pages, and a regex using \b would match inside it. */
  const r = fixture(({ rewrite }) => rewrite('guides/jade-setup.html',
    '<div class="sc-article">', '<div id="body" class="wide sc-article extra" data-x="1">'));
  ok('extra attributes and surrounding classes are tolerated',
    r.structural.length === 0 && r.sentences > 6600,
    `${r.sentences} sentences, structural ${JSON.stringify(r.structural)}`);
}
{
  const r = fixture(({ rewrite }) => rewrite('guides/jade-setup.html',
    '<div class="sc-article">', '<div class="sc-body">'));
  ok('a guide body that cannot be read is a structural failure',
    r.structural.some(s => /no readable article body/.test(s)), JSON.stringify(r.structural));
}
{
  const r = fixture(({ rewrite }) => rewrite('software.html',
    /<article([^>]*)class="([^"]*)sc-detail([^"]*)"/, '<article$1class="$2sc-details$3"'));
  ok('a product detail section that goes missing is a structural failure',
    r.structural.some(s => /detail sections/.test(s)), JSON.stringify(r.structural));
}

/* Coverage counts are part of the report, so a change that quietly reduces
   them is visible. */
{
  const r = checkPolarity('.');
  ok('the report carries explicit coverage counts',
    r.dashes === 87 && r.checked === 73,
    `${r.checked} of ${r.dashes} -- if the matrices changed on purpose, update MATRIX_PAGES and this case`);
  /* Matrix counts did not move in the class-change defect above. The sentence
     count did, by about a hundred, and nothing was reading it. */
  ok('the report carries a prose count too',
    r.sentences > 6000, `${r.sentences} sentences`);
}

if (failures) {
  console.error(`\n  ABORT: ${failures} polarity guard case(s) failed`);
  process.exit(1);
}
console.log('polarity guard: 24 cases pass -- planted claims found, denials ignored, partial loss of the matrices or the prose fatal');

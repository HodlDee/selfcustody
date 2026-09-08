/* A comparison table and a guide may not say opposite things about a product.

   Every product on this site is described twice: once as a mark in a feature
   matrix on devices.html, software.html or exchanges.html, and again in prose
   somewhere in the guide library. The two are written months apart, by
   different passes, from different sources -- and nothing connected them. A
   matrix cell could say a device has no air-gapped signing path while a guide
   walked the reader through using one, and the build would be perfectly happy.

   That is the specific failure this guard exists for, and it is worth stating
   what makes it worse than an ordinary typo. A reader who notices the
   contradiction learns that the site does not check itself. A reader who does
   not notice takes whichever half they read first and acts on it. Neither
   outcome is acceptable on a site whose whole instruction is verify rather
   than trust, so this is asserted rather than left to review.

   ---------------------------------------------------------------- scope ----

   Only dashes are checked -- cells marked "not part of the standard
   workflow". A dash is a flat denial, so prose asserting the capability is a
   flat contradiction, and there is no reading under which both are true.

   "Optional or model-dependent" is deliberately out of scope. Prose saying a
   device does something a matrix marks half-available is usually correct and
   more specific than the mark, and flagging it would train whoever reads this
   output to skim past it. A guard nobody reads is worse than no guard.

   The matrices are read from what is actually written to docs/, because that
   is the copy a reader receives. The prose is read from the guide bodies and
   the product detail sections, and not from index pages -- a card grid
   concatenates a dozen summaries and their tag chips into text that reads
   like a sentence and is not one.

   -------------------------------------------------- how a claim is found ----

   Co-occurrence is not attribution, and assuming otherwise is how this kind of
   check becomes noise. "USB for Trezor, Ledger and BitBox02; microSD for
   COLDCARD; QR for SeedSigner and Passport" names seven products and three
   capabilities and attributes none of them wrongly. A first version of this
   guard flagged that sentence six times.

   So a claim has to be shaped like one: the product and the capability joined
   by something that predicates one of the other -- has, offers, supports,
   ships with, signs over, its own -- with no negation between them. Anything
   looser was measured against the library as it stands and produced dozens of
   candidates, none of them real.

   ------------------------------------------------------------- limits ----

   This finds a subset, and the subset is worth stating rather than leaving for
   someone to discover when it misses something.

     - A claim has to sit within SPAN characters of the product name. A long
       clause between them is not seen.
     - A denial anywhere in that window suppresses the match, so "not only a
       USB device -- it also signs air-gapped" reads as a denial and is missed.
       Erring this way is deliberate: the library states limitations far more
       often than capabilities, and a guard that flagged every one of those
       would be turned off within a week.
     - Fourteen of the dashes sit on rows with no phrasing distinctive enough
       to match on, and are not checked at all.
     - Only dashes are checked. A wrong "yes" or a wrong "partial" is invisible
       to this.

   Hence the wording of the success line: no unacknowledged candidates among
   the checked pairs. Not "the site is consistent", which this cannot establish.

   ------------------------------------------------------- acknowledgements ----

   Matching prose is a heuristic and always will be, so every candidate is
   either a contradiction or a recorded judgement. ACKNOWLEDGED holds the
   pairings that were read and found correct, each with the reason. That has
   two consequences worth having: the reasoning is in the repository rather
   than in a review comment nobody can find later, and editing an acknowledged
   sentence changes its digest and puts it back in front of a reviewer, which
   is the moment the judgement is most likely to have gone stale. */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, basename } from 'node:path';

/* The pages carrying a feature matrix, and the shape each one must still have.

   The counts are here because of the failure mode this guard is least allowed
   to have, which review found it had: it got *quieter* as it saw less. Deleting
   a matrix row removed four dashes from the check and reported success. So did
   renaming the class that marks a cell. Only losing an entire table was noticed,
   and that is the one accident nobody has.

   So the shape is asserted rather than discovered. If a row, a column or a
   whole matrix goes, this fails and says which -- and a deliberate change to
   the tables means updating a number here, which is a line in a diff a reviewer
   can see rather than a silent reduction in what is being checked. */
const MATRIX_PAGES = [
  { file: 'docs/devices.html',   matrices: 1, columns: 9, rows: 13 },
  { file: 'docs/software.html',  matrices: 1, columns: 7, rows: 13 },
  { file: 'docs/exchanges.html', matrices: 1, columns: 6, rows: 9 }
];

/* Column headings name a model or a range; prose names the brand. Each pattern
   has to match the way a guide would actually refer to the product, which is
   rarely the way a table column does. */
const PRODUCT_PATTERNS = {
  'Trezor Safe 7':         String.raw`Trezor(?:\s+Safe(?:\s+\w+)?)?`,
  'Bitkey':                String.raw`Bitkey`,
  'BitBox02':              String.raw`BitBox02`,
  'Blockstream Jade Plus': String.raw`(?:Blockstream\s+)?Jade(?:\s+Plus)?`,
  'COLDCARD Q / Mk5':      String.raw`COLDCARD(?:\s+(?:Q|Mk\d))?`,
  'Foundation Passport':   String.raw`(?:Foundation\s+)?Passport(?:\s+Prime)?`,
  'SeedSigner':            String.raw`SeedSigner`,
  'Krux':                  String.raw`Krux`,
  'Ledger':                String.raw`Ledger(?:\s+(?:Nano|Flex|Stax)(?:\s+\w+)?)?`,
  'Sparrow':               String.raw`Sparrow`,
  'Nunchuk':               String.raw`Nunchuk`,
  'Cove':                  String.raw`Cove`,
  'Electrum':              String.raw`Electrum`,
  'BlueWallet':            String.raw`BlueWallet`,
  'Wasabi':                String.raw`Wasabi`,
  'Specter':               String.raw`Specter(?:\s+Desktop)?`,
  'Bull Bitcoin':          String.raw`Bull\s+Bitcoin`,
  'Bitcoin Well':          String.raw`Bitcoin\s+Well`,
  'Shakepay':              String.raw`Shakepay`,
  'Ndax':                  String.raw`Ndax`,
  'Kraken':                String.raw`Kraken`,
  'Bitbuy':                String.raw`Bitbuy`
};

/* What the capability sounds like in prose, keyed by the matrix row it belongs
   to. A row with no entry here is not checked, and that is a deliberate
   position rather than an omission: "Transaction review on device" and
   "Interac e-Transfer" have no phrasing distinctive enough to tell a claim
   from a passing mention, and a check that cannot tell those apart would only
   produce work. Rows that are all-yes are not listed either, since there is no
   dash for prose to contradict. */
const CAPABILITY_PATTERNS = {
  'Dedicated key-isolation chip':   String.raw`secure element|secure chip|key.isolation chip`,
  'Bitcoin only firmware':          String.raw`[Bb]itcoin.only firmware`,
  'Fully air-gapped signing path':  String.raw`air.?gapp?e?d?`,
  'Camera-based QR signing':        String.raw`QR(?:\s+code)?s?\b|camera`,
  'Removable media for signing':    String.raw`micro ?SD|SD card`,
  'Removable-media backup':         String.raw`micro ?SD|SD card`,
  'USB data connection':            String.raw`USB`,
  'Bluetooth':                      String.raw`Bluetooth`,
  'NFC':                            String.raw`NFC`,
  'Recovery words supported':       String.raw`recovery words|seed phrase|BIP.?39`,
  'Runs without storing a seed':    String.raw`stateless|amnesic`,
  'Desktop app':                    String.raw`desktop app`,
  'Mobile app':                     String.raw`mobile app|phone app`,
  'Personal/private node support':  String.raw`own node|personal node`,
  'Tor support':                    String.raw`Tor\b`,
  'CoinJoin / advanced privacy':    String.raw`CoinJoin`,
  'Coin control / UTXO management': String.raw`coin control`,
  'Labels (BIP-329)':               String.raw`BIP.?329`,
  'Multisig support':               String.raw`multisig|multisignature`,
  'Lightning support':              String.raw`Lightning`,
  'Bitcoin-only platform':          String.raw`[Bb]itcoin.only`,
  'Direct-to-wallet settlement':    String.raw`direct.to.wallet`,
  'Order-book / pro trading interface': String.raw`order.book`
};

/* The verbs that turn a mention into a claim. Nothing here is a preposition on
   its own: "QR for SeedSigner" is a routing instruction, not an assertion that
   SeedSigner reads QR codes -- even though in that case it happens to. */
const PREDICATES = String.raw`has|have|had|offers?|supports?|includes?|provides?|ships? with|comes? with|carries|carry|adds?|uses?|signs? over|works? over|connects? over|pairs? over|reads?|writes?|backs? up to|is|are|with(?: an?| its)?|'s|’s`;

/* A denial anywhere between the product and the capability turns the claim
   into agreement with the dash. These are the forms the library actually uses;
   each one was found in prose this guard flagged before it understood them.
   The library states limitations far more often than capabilities, so this
   list does more work than any other part of the matcher. */
const DENIALS = String.raw`\bno\b|\bnot\b|\bnever\b|\bwithout\b|\blacks?\b|\bcannot\b|\bcan't\b|\bnor\b|\brather than\b|\binstead of\b|\bdrops?\b|\bdropped\b|\bremoved?\b|\babsent\b|\bunlike\b|\bunless\b`;

/* Not denials, but the same effect here: they say the sentence is about a
   different model from the one the column names. A matrix column is a current
   product, and the guides discuss superseded ones -- the Passport guide
   mentions the earlier bitcoin-only Passport, which really was bitcoin-only,
   against a column that is about Passport Prime, which is not. */
const OTHER_MODEL = String.raw`\bearlier\b|\bolder\b|\bformer\b|\bprevious\b|\bsuperseded\b|\bdiscontinued\b`;

const NEGATIONS = `${DENIALS}|${OTHER_MODEL}`;

/* How close the two have to be. Long enough for "the BitBox02 backs up to a
   microSD card", short enough that two unrelated clauses in one sentence do
   not count as a claim about each other. */
const SPAN = 70;

/* Read and found correct. Each entry names the pairing, the page, a digest of
   the sentence as it stood when it was read, and why it is not a
   contradiction. A sentence that changes loses its digest and comes back for
   review, which is the point. */
const ACKNOWLEDGED = [
  /* Two rows in the devices matrix use the same word for different things:
     "Removable media for signing" is a card carrying a PSBT, and
     "Removable-media backup" is a card carrying the seed. The BitBox02 has a
     dash on the first and a check on the second, and the guide is describing
     the second. Nothing distinguishes them in prose, so this pair costs two
     acknowledgements rather than a cleverer pattern. */
  { product: 'BitBox02', feature: 'Removable media for signing',
    where: 'guides/bitbox02-setup.html', digest: 'f093d89790',
    why: 'Describes the microSD backup, which the matrix marks available. Signing is a separate row and is correctly dashed.' },
  { product: 'BitBox02', feature: 'Removable media for signing',
    where: 'guides/bitbox02-setup.html', digest: '2d32ba68ff',
    why: 'Alt text for a photograph. Describes a card in the slot, and claims nothing about what it is for.' }
];

const stripTags = s => s
  .replace(/<[^>]+>/g, ' ')
  .replace(/&mdash;|&#8212;/g, '—')
  .replace(/&nbsp;|&#160;/g, ' ')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;|&rsquo;/g, "'")
  .replace(/&[a-z]+;|&#\d+;/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const digest = s => createHash('sha256').update(s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()).digest('hex').slice(0, 10);

/* Every dash in every matrix, as {page, feature, product}. */
function readMatrices(root, structural) {
  const cells = [];
  for (const { file, matrices, columns: expectColumns, rows: expectRows } of MATRIX_PAGES) {
    const page = basename(file);
    const path = join(root, file);
    if (!existsSync(path)) {
      structural.push(`${file} carries a feature matrix and is not there to read`);
      continue;
    }
    const html = readFileSync(path, 'utf8');
    const tables = html.match(/<table[^>]*sc-feature-matrix[^>]*>[\s\S]*?<\/table>/g) || [];
    if (tables.length !== matrices) {
      structural.push(`${page} should carry ${matrices} feature matrix/matrices and has ${tables.length}`);
      continue;
    }
    for (const table of tables) {
      const columns = [...table.matchAll(/<th scope="col">([\s\S]*?)<\/th>/g)]
        .map(m => stripTags(m[1])).slice(1);
      if (columns.length !== expectColumns) {
        structural.push(`${page}: the matrix should compare ${expectColumns} products and compares ${columns.length}` +
          ` (${columns.join(', ') || 'none readable'})`);
      }

      let rows = 0;
      for (const row of table.match(/<tr>[\s\S]*?<\/tr>/g) || []) {
        const head = row.match(/<th scope="row">([\s\S]*?)<\/th>/);
        if (!head) continue;
        rows++;
        const feature = stripTags(head[1]);
        const bodyCells = [...row.matchAll(/<td>([\s\S]*?)<\/td>/g)].map(m => m[1]);

        if (bodyCells.length !== columns.length) {
          structural.push(`${page}: row "${feature}" has ${bodyCells.length} cells against ${columns.length} product columns`);
        }

        bodyCells.forEach((cell, i) => {
          /* Anchored on the closing quote or a space, so a renamed class is an
             unrecognised mark rather than a lucky prefix match. Review renamed
             sc-matrix-no to sc-matrix-none and the old pattern went on matching
             it, which is the sort of accident that only holds until it does
             not. */
          const mark = (cell.match(/sc-matrix-(yes|partial|no)(?=["\s])/) || [])[1];
          if (!mark) {
            structural.push(`${page}: row "${feature}", column ${i + 1}` +
              `${columns[i] ? ` (${columns[i]})` : ''} carries no recognisable mark`);
            return;
          }
          if (mark === 'no' && columns[i]) cells.push({ page, feature, product: columns[i] });
        });
      }

      if (rows !== expectRows) {
        structural.push(`${page}: the matrix should have ${expectRows} feature rows and has ${rows}`);
      }
    }
  }
  return cells;
}

/* Does this tag's class attribute carry `name` as a whole token?

   Written out rather than done with a regex because the obvious regex is
   wrong. `\\bsc-article\\b` matches inside `sc-article-num`, since a hyphen is
   a non-word character and the boundary falls between "article" and "-".
   Splitting the attribute on whitespace cannot make that mistake. */
function hasClass(tag, name) {
  const attr = tag.match(/\sclass="([^"]*)"/);
  return !!attr && attr[1].split(/\s+/).includes(name);
}

/* Every opening tag of `element` carrying `className`, whatever else is on it.

   The first version matched the literal string `<div class="sc-article">`.
   Review added one further class to one guide -- a change with no visible
   effect, of exactly the kind someone makes while styling a page -- and the
   guard read none of that guide's prose, found none of the contradiction
   planted in it, reported no structural problem, and passed. The sentence
   count fell by a hundred and nothing was looking at the sentence count. */
function openingTags(html, element, className) {
  const positions = [];
  for (const m of html.matchAll(new RegExp(`<${element}\\b[^>]*>`, 'g'))) {
    if (hasClass(m[0], className)) positions.push(m.index);
  }
  return positions;
}

/* The prose a reader would take as a statement about a product: guide bodies,
   and the detail sections on the product pages. Matrices, legends and source
   notes are cut out first -- a table describing a dash is not prose claiming
   the opposite of one.

   Extraction failure is a structural failure here, not an empty result. A page
   that should have a body and does not is the guard going blind on that page,
   and going blind quietly is the thing this file keeps having to be taught not
   to do. */
function readProse(root, structural) {
  const units = [];
  const push = (where, html) => {
    const text = stripTags(
      html.replace(/<table[\s\S]*?<\/table>/g, ' ')
          .replace(/<(script|style|nav|header|footer)[\s\S]*?<\/\1>/g, ' ')
    );
    for (const sentence of text.split(/(?<=[.!?])\s+/)) {
      const trimmed = sentence.trim();
      if (trimmed.length > 20) units.push({ where, sentence: trimmed });
    }
  };

  const guides = join(root, 'docs/guides');
  for (const file of readdirSync(guides).filter(f => f.endsWith('.html')).sort()) {
    const html = readFileSync(join(guides, file), 'utf8');
    const bodies = openingTags(html, 'div', 'sc-article');

    if (!bodies.length) {
      /* The two redirect stubs have no article and are not meant to. Anything
         else without one is a page this guard cannot see. */
      if (!/<meta[^>]+http-equiv="refresh"/i.test(html)) {
        structural.push(`guides/${file} has no readable article body, so none of its prose is checked`);
      }
      continue;
    }

    for (const start of bodies) {
      const end = html.indexOf('</main>', start);
      if (end === -1) {
        structural.push(`guides/${file} opens an article body that never reaches </main>`);
        continue;
      }
      push(`guides/${file}`, html.slice(start, end));
    }
  }
  for (const { file, columns } of MATRIX_PAGES) {
    const path = join(root, file);
    if (!existsSync(path)) continue;
    const html = readFileSync(path, 'utf8');
    const starts = openingTags(html, 'article', 'sc-detail');

    /* One detail section per compared product. That is a property of how these
       pages are written rather than a number picked to be asserted, which is
       what makes it worth asserting: if the two drift apart, either a product
       lost its prose or the matrix gained a column nobody described. */
    if (starts.length !== columns) {
      structural.push(`${basename(file)}: ${starts.length} product detail sections against ${columns} matrix columns`);
    }

    for (const start of starts) {
      const end = html.indexOf('</article>', start);
      if (end === -1) {
        structural.push(`${basename(file)} opens a product detail that never closes`);
        continue;
      }
      push(basename(file), html.slice(start, end));
    }
  }
  return units;
}

/* The three shapes a claim takes, compiled once per pairing rather than once
   per sentence -- the difference is a second of build time. */
function claimForms(productPattern, capabilityPattern) {
  const p = productPattern, c = capabilityPattern;
  const gap = `[^.;]{0,${SPAN}}?`;
  return [
    /* the device has / offers / ships with / is air-gapped */
    new RegExp(`\\b(?:${p})\\b(${gap})\\b(?:${PREDICATES})\\b(${gap})\\b(?:${c})`, 'i'),
    /* its microSD backup, the Jade's camera */
    new RegExp(`\\b(?:${p})(?:'s|\u2019s)\\s+(${gap})\\b(?:${c})`, 'i'),
    /* air-gapped signing on the SeedSigner */
    new RegExp(`\\b(?:${c})\\b(${gap})\\b(?:on|in)\\s+(?:the\\s+|a\\s+|your\\s+)?(?:${p})\\b`, 'i')
  ];
}

const NEGATED = new RegExp(NEGATIONS, 'i');
const NEGATED_LEAD = new RegExp(`(?:${NEGATIONS})\\s*$`, 'i');

/* Does this sentence predicate the capability of the product? */
function claims(sentence, forms) {
  for (const form of forms) {
    const hit = sentence.match(form);
    if (!hit) continue;
    const between = hit.slice(1).filter(Boolean).join(' ');
    if (NEGATED.test(between)) continue;
    /* A negation immediately before the whole match denies it too:
       "no air-gapped signing path" does not become a claim because the words
       between product and capability happen to be clean. */
    if (NEGATED_LEAD.test(sentence.slice(Math.max(0, hit.index - 24), hit.index))) continue;
    return hit[0];
  }
  return null;
}

/* Separated from the reporting so the guard's own behaviour can be exercised
   against a fixture. A heuristic that has never been shown to fire is a
   comment, not a check. */
export function checkPolarity(root = '.') {
  const structural = [];
  const dashes = readMatrices(root, structural);
  const prose = readProse(root, structural);
  const acknowledged = new Map(ACKNOWLEDGED.map(a => [`${a.product}|${a.feature}|${a.where}|${a.digest}`, a]));
  const seen = new Set();
  const conflicts = [];

  for (const { feature, product, page } of dashes) {
    const capability = CAPABILITY_PATTERNS[feature];
    const productPattern = PRODUCT_PATTERNS[product];
    if (!capability || !productPattern) continue;
    const forms = claimForms(productPattern, capability);
    for (const { where, sentence } of prose) {
      const matched = claims(sentence, forms);
      if (!matched) continue;
      const key = `${product}|${feature}|${where}|${digest(sentence)}`;
      if (acknowledged.has(key)) { seen.add(key); continue; }
      conflicts.push({ product, feature, page, where, sentence, matched, key });
    }
  }

  const stale = [...acknowledged.keys()].filter(k => !seen.has(k));
  const checked = dashes.filter(d => CAPABILITY_PATTERNS[d.feature] && PRODUCT_PATTERNS[d.product]).length;
  return { structural, conflicts, stale, dashes: dashes.length, checked, sentences: prose.length };
}

export function assertPolarity() {
  const { structural, conflicts, stale, dashes, checked, sentences } = checkPolarity('.');

  if (structural.length) {
    console.error('\n  ABORT: a page this guard depends on cannot be read');
    for (const s of structural) console.error(`    ${s}`);
    process.exit(1);
  }

  if (conflicts.length || stale.length) {
    console.error('\n  ABORT: a feature matrix and a guide disagree about a product');
    for (const c of conflicts) {
      console.error(`\n    ${c.page} marks ${c.product} as not offering "${c.feature}".`);
      console.error(`    ${c.where} says:`);
      console.error(`      ${c.sentence}`);
      console.error(`    (matched: "${c.matched.trim()}")`);
      console.error('    If the prose is right and only reads like a claim, this is the entry:');
      console.error(`      { product: ${JSON.stringify(c.product)}, feature: ${JSON.stringify(c.feature)},`);
      console.error(`        where: ${JSON.stringify(c.where)}, digest: '${digest(c.sentence)}',`);
      console.error(`        why: '...' },`);
    }
    if (stale.length) {
      console.error('\n    These acknowledgements in build/tools/assert-polarity.mjs no longer');
      console.error('    match anything, so the sentence was edited or removed. Re-read it and');
      console.error('    either update the digest or delete the entry:');
      for (const k of stale) console.error(`      ${k}`);
    }
    console.error('\n    Fix whichever side is wrong. If both are right and the prose only');
    console.error('    reads like a claim, add it to ACKNOWLEDGED with the reason.\n');
    process.exit(1);
  }

  /* Deliberately not "no contradictions". This checks predicated claims about
     dashed capabilities inside a 70-character window, which is a subset of the
     things a page can assert -- see the limits above. Reporting semantic
     consistency of the whole site would be a claim the guard cannot support,
     and the point of the guard is not making claims like that. */
  console.log(`polarity check: ${checked} of ${dashes} dashes against ${sentences} sentences of product prose` +
    `, no unacknowledged candidates among the checked pairs`);
}

if (import.meta.url === `file://${process.argv[1]}`) assertPolarity();

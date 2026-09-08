/* The ?v= query stamped on the site's CSS and JS.

   Its own module rather than a function inside render.mjs, because render.mjs
   is a script: importing anything from it builds the entire site as a side
   effect, which is not what a test of a hash function should do.

   CR is stripped before hashing, so the digest describes the content of these
   files rather than the line endings of the checkout that produced them.

   .gitattributes pins the hashed assets to LF, which is the primary fix and
   the one that stops git handing the build different bytes in the first place.
   This is the second half, and it is here because the digest should not depend
   on git at all: a zip download, an editor that helpfully "fixed" the endings,
   or a checkout made before those attributes existed would otherwise produce a
   different version string and rewrite the query on all 72 pages with no CSS
   or JS actually changed.

   Found in review. An LF machine builds clean either way, which is why
   consecutive local builds never surfaced it. */

import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

export function assetDigest(files) {
  return files
    .reduce((hash, file) => hash.update(readFileSync(file, 'utf8').replace(/\r\n?/g, '\n')), createHash('sha256'))
    .digest('hex')
    .slice(0, 12);
}

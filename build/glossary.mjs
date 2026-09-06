/* The glossary, as data.

   Every definition here is written for this site and licensed with the rest of
   its prose. The page used to fetch a wider lexicon from a third party at
   runtime, which meant the glossary went blank when that service was
   unreachable, put several hundred definitions the project had not written in
   front of readers, and rested on content published under no licence at all.

   The scope is deliberate: the vocabulary these guides actually use, defined
   the way this site would define it, rather than a catalogue of everything
   anyone has said about bitcoin. Trading metrics, price speculation and meme
   vocabulary are left out on purpose.

   Consumed by build/content.mjs, which renders the cards into glossary.html at
   build time -- so the anchors guides link to exist in the HTML rather than
   being assembled by script after load. site-refresh.js reads the same cards
   back out of the DOM to power search and the letter filter, which are
   enhancements on top of a page that already works without them.

   Shape: id (the #term- anchor), title, definition, example, categories. */

const glossaryTerms = [
  {
    "id": "21_million",
    "title": "21 million",
    "definition": "The approximate total number of bitcoin that will ever exist — slightly under, because the subsidy is halved using integer arithmetic and rounds away small amounts, and because coins with lost keys are permanently unspendable. The figure is a consequence of the halving schedule rather than a parameter set independently.",
    "example": "The final fraction of the supply is issued so slowly that the last coins are not expected until well into the next century.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "fifty_one_percent_attack",
    "title": "51% attack",
    "definition": "Controlling enough mining power to outpace the rest of the network and rewrite recent history. It would allow reversing recent transactions, and it would not allow creating coins, changing the supply, or spending anyone else's — those are enforced by nodes rather than by miners.",
    "example": "The attack's realistic effect is undoing a recent payment, which is why large amounts wait for more confirmations.",
    "categories": [
      "Technical",
      "Threats"
    ]
  },
  {
    "id": "account_path",
    "title": "Account path",
    "definition": "The first three steps of a derivation path — m/84'/0'/0' — naming the script type, the coin, and which account. Everything a wallet shows you hangs below it: receiving addresses on one branch, change on another. It is the level an extended public key is normally exported from, so a wallet can watch a whole account without being handed anything that spends.",
    "example": "One seed can hold several accounts — m/84'/0'/0' and m/84'/0'/1' share recovery words but behave as separate wallets with separate balances.",
    "categories": [
      "Wallets",
      "Recovery",
      "Technical"
    ]
  },
  {
    "id": "address_reuse",
    "title": "Address reuse",
    "definition": "Receiving more than once to the same address. It costs nothing technically and a great deal in privacy: every payment to that address is publicly linked to every other, permanently, and the link cannot be withdrawn later. Wallets generate a fresh address for each payment for this reason, and the gap limit exists because they do.",
    "example": "Publishing one donation address links every contribution to it, which is the problem silent payments were designed to remove.",
    "categories": [
      "Privacy"
    ]
  },
  {
    "id": "address_substitution",
    "title": "Address substitution",
    "definition": "Malware that watches for something address-shaped and replaces it with the attacker's own. It breaks no cryptography and needs no privilege beyond reading your clipboard. The defence is not vigilance on the computer but reading the address on the signing device, which the malware cannot reach.",
    "example": "The computer and the browser both show the attacker's address; only the device shows yours.",
    "categories": [
      "Threats",
      "Security"
    ]
  },
  {
    "id": "air_gap",
    "title": "Air gap",
    "definition": "An arrangement where the device holding keys has no electrical or radio connection to a networked machine, and data crosses by microSD card or QR code instead. It removes an attack surface rather than every attack surface: a transaction can still be signed for the wrong address if it is approved without reading the device screen.",
    "example": "Carrying a PSBT to a signer on a microSD card preserves the air gap; plugging the same signer into the computer by USB does not.",
    "categories": [
      "Security",
      "Hardware Wallets",
      "Connectivity"
    ]
  },
  {
    "id": "attestation",
    "title": "Attestation",
    "definition": "A statement, signed by a build system, that a particular artifact came from a particular source. It binds a file to the repository and workflow that produced it, so a download can be checked against something more specific than a hash served from the same place as the file.",
    "example": "An attestation records the repository as it stood when signed, so a copy downloaded before a rename verifies under the old name.",
    "categories": [
      "Security",
      "Firmware",
      "Open Source"
    ]
  },
  {
    "id": "bech32",
    "title": "bech32",
    "definition": "The address encoding used by native SegWit, producing lowercase strings beginning bc1q. Its checksum catches typos reliably and it is case-insensitive, which makes it easier to read aloud or transcribe than the older format. bech32m is the revised version used by Taproot.",
    "example": "A mistyped bech32 address is almost always rejected by the sending wallet rather than accepted and sent nowhere.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "bip32",
    "title": "BIP32",
    "definition": "The standard defining hierarchical deterministic wallets: how a seed becomes a master key and chain code, how child keys are derived from parents, and the difference between hardened and ordinary derivation. Everything about paths, xpubs and watch-only wallets rests on it.",
    "example": "BIP32 is why one backup can restore a wallet holding thousands of addresses across several accounts.",
    "categories": [
      "Technical",
      "Recovery"
    ]
  },
  {
    "id": "bip39",
    "title": "BIP39",
    "definition": "The standard behind recovery phrases: a fixed list of 2,048 words, a rule for turning random bits into a sequence of them, a checksum that catches most transcription errors, and a key-stretching step that turns the words plus an optional passphrase into a wallet seed. Widely implemented, which is what lets one phrase restore across different software — though the derivation path still has to match.",
    "example": "A twelve-word BIP39 phrase encodes 128 bits of entropy plus a four-bit checksum, which is why thirteen words is not a valid phrase.",
    "categories": [
      "BIP39",
      "Backups",
      "Recovery",
      "Technical"
    ]
  },
  {
    "id": "bip44",
    "title": "BIP44",
    "definition": "The standard that gave derivation paths their shape — purpose, coin type, account, change, index — and set the address gap limit at twenty. Its own purpose number, 44', now means legacy addresses specifically, while the structure it introduced is used by every later scheme.",
    "example": "A wallet defaulting to m/44'/0'/0' derives legacy addresses beginning with 1.",
    "categories": [
      "Technical",
      "Recovery"
    ]
  },
  {
    "id": "bip48",
    "title": "BIP48",
    "definition": "The derivation scheme for multisig wallets, which adds a script-type level to the path so that the same seed can participate in wallets of different kinds. Multisig needs it because the address depends on every co-signer's key, not only your own.",
    "example": "A 2-of-3 native SegWit multisig typically derives its keys from m/48'/0'/0'/2'.",
    "categories": [
      "Multisig",
      "Technical",
      "Recovery"
    ]
  },
  {
    "id": "bip84",
    "title": "BIP84",
    "definition": "The derivation scheme for native SegWit addresses, using purpose 84' and producing addresses beginning bc1q. It is the common default in current wallets, which is why restoring an older seed into new software sometimes shows an empty wallet until the path is changed.",
    "example": "m/84'/0'/0' is the account path most wallets create by default today.",
    "categories": [
      "Technical",
      "Recovery"
    ]
  },
  {
    "id": "bip85",
    "title": "BIP85",
    "definition": "A scheme for deriving fresh, independent seed phrases from one master seed and an index number. The children are ordinary wallets that reveal nothing about the master or about each other, so one backup can stand behind several wallets — provided the index and word count are recorded, because nothing in a child seed identifies them.",
    "example": "Index 0 at twelve words produces one wallet; index 1 produces an unrelated one, both recoverable from the same master.",
    "categories": [
      "Backups",
      "Recovery",
      "Technical"
    ]
  },
  {
    "id": "bip86",
    "title": "BIP86",
    "definition": "The derivation scheme for single-key Taproot addresses, using purpose 86' and producing addresses beginning bc1p. Support is widespread but not universal, and a wallet that cannot derive this path will not find coins held on it.",
    "example": "A Taproot wallet at m/86'/0'/0' produces bc1p addresses that some older software cannot send to.",
    "categories": [
      "Technical",
      "Recovery"
    ]
  },
  {
    "id": "bitcoin_only",
    "title": "Bitcoin-only",
    "definition": "Hardware or software that supports bitcoin and nothing else. The argument is narrow and practical: less code means a smaller attack surface and fewer features whose failure modes you have to understand. Several manufacturers ship a bitcoin-only firmware edition alongside a multi-asset one, and on some devices the switch is permanent.",
    "example": "Choosing the bitcoin-only firmware at setup removes support for every other asset, which is the point rather than a limitation.",
    "categories": [
      "Firmware",
      "Hardware Wallets",
      "Security"
    ]
  },
  {
    "id": "block",
    "title": "Block",
    "definition": "A batch of transactions accepted together, linked to the one before it. Blocks arrive roughly every ten minutes on average, which is not a schedule — gaps of forty minutes are ordinary. Space in one is finite, which is what fees bid for.",
    "example": "A transaction is confirmed once when the block containing it is mined, and gains a confirmation with each block after.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "block_explorer",
    "title": "Block explorer",
    "definition": "A website that indexes the blockchain so transactions and addresses can be looked up. Useful for confirming a payment exists, and worth using carefully: searching for your own address tells the operator that whoever holds it visited from your connection, which is exactly the link a wallet pointed at your own node avoids creating.",
    "example": "Pasting a receive address into an explorer to check a payment arrived also reveals that address, and your interest in it, to whoever runs the site.",
    "categories": [
      "Privacy",
      "Connectivity"
    ]
  },
  {
    "id": "block_height",
    "title": "Block height",
    "definition": "How many blocks precede a given one, counting from the genesis block at zero. It is the chain's clock: halvings, difficulty adjustments and timelocks are all expressed in heights rather than dates, because heights are unambiguous and dates are not.",
    "example": "A timelock set to a future height opens when the chain reaches it, whenever that happens to be.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "block_subsidy",
    "title": "Block subsidy",
    "definition": "The new bitcoin created in each block and paid to whoever mined it. It halves every 210,000 blocks and will eventually round to nothing, at which point miners are paid by transaction fees alone. It is the entire mechanism by which bitcoin is issued.",
    "example": "The subsidy and the fees of the included transactions together make up the block reward.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "blockchain",
    "title": "Blockchain",
    "definition": "The ordered chain of blocks recording every transaction. It tracks amounts and spending conditions rather than people or balances, and it is public — which is the source of both its verifiability and its privacy problems. Nothing in it can be edited; history is only extended.",
    "example": "A wallet's balance is not stored in the chain; it is computed by finding the unspent outputs its keys can claim.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "broadcast",
    "title": "Broadcast",
    "definition": "Handing a signed transaction to the network by sending it to a node, which relays it onward. It is not a submission to any authority — nobody accepts or rejects it, and an unbroadcast transaction has changed nothing. Until it is mined, it sits in mempools waiting.",
    "example": "A transaction signed on an air-gapped device does nothing until the coordinator broadcasts it.",
    "categories": [
      "Technical",
      "Connectivity"
    ]
  },
  {
    "id": "chain_analysis",
    "title": "Chain analysis",
    "definition": "Applying assumptions at scale to the public ledger to work out who controls what. Nobody is watching you specifically; a set of individually unremarkable inferences is applied to everyone. It works by combining weak signals rather than breaking anything, which is why the goal is raising the cost of the inference rather than achieving anonymity.",
    "example": "An analyst combines shared inputs, change detection and timing to link addresses that were never obviously connected.",
    "categories": [
      "Privacy",
      "Threats"
    ]
  },
  {
    "id": "chain_code",
    "title": "Chain code",
    "definition": "Thirty-two bytes of additional entropy carried alongside a key, mixed into every child derivation. It is what makes a key extended: with the chain code, a whole branch can be derived from one string; without it, knowing a key tells you nothing about its siblings.",
    "example": "An xpub is a public key and a chain code together, which is exactly what a watch-only wallet needs to derive future addresses.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "change_address",
    "title": "Change address",
    "definition": "An address in your own wallet that receives the remainder when a coin is spent. Coins are spent whole, so paying part of one sends the rest back to you. Change is the output nobody checks, and verifying it belongs to your wallet is what stops a compromised computer redirecting the remainder.",
    "example": "Paying 0.01 from a 0.5 coin produces the payment and a 0.49 change output, which should be confirmed on the signing device as your own.",
    "categories": [
      "Technical",
      "Privacy",
      "Wallets"
    ]
  },
  {
    "id": "change_detection",
    "title": "Change detection",
    "definition": "Working out which output of a transaction returned to the sender. Roundness is the obvious signal — payments are round, change is the remainder — but script type, address reuse, unnecessary inputs and output ordering all give it away too. Identifying change is what turns isolated transactions into a traceable chain.",
    "example": "Paying 0.05 from a 0.31 coin leaves an awkward remainder that is obviously the change.",
    "categories": [
      "Privacy"
    ]
  },
  {
    "id": "checksum",
    "title": "Checksum",
    "definition": "A short value calculated from a larger piece of data specifically to catch errors in it. Bitcoin uses checksums in several unrelated places: the final word of a BIP39 recovery phrase encodes a checksum of the words before it, so most (not all) transcription mistakes produce an invalid phrase rather than a silently different wallet; bech32 addresses carry a checksum strong enough to catch typos reliably; and software releases are distributed with a checksum file so a download can be verified against what the developers actually published.",
    "example": "Before flashing a signer's firmware, a user checks the published SHA256 checksum against the file they downloaded to confirm nothing was altered in transit.",
    "categories": [
      "Technical",
      "Backups",
      "Security"
    ]
  },
  {
    "id": "child_pays_for_parent",
    "title": "Child pays for parent (CPFP)",
    "definition": "Speeding up a stuck transaction by spending one of its outputs in a new transaction with a high fee. Miners assess the pair together, so the child's fee effectively pays for the parent. It is the option available to the recipient, who cannot replace a transaction they did not send.",
    "example": "Waiting on a slow incoming payment, you can spend its output to yourself at a high fee rate to pull both into a block.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "coin_control",
    "title": "Coin control",
    "definition": "Choosing which UTXOs a transaction spends rather than letting the wallet decide. It is the highest-value privacy habit available, because spending coins together publicly asserts they share an owner. It is also how dust of unknown origin is kept out of transactions, by freezing it rather than reasoning about it.",
    "example": "Paying from a single coin close to the payment amount avoids linking unrelated coins and avoids an obvious change output.",
    "categories": [
      "Privacy",
      "Wallets"
    ]
  },
  {
    "id": "coinbase_transaction",
    "title": "Coinbase transaction",
    "definition": "The first transaction in every block, which creates the subsidy and collects the fees. It has no inputs, because it is where new coins come from. Its output cannot be spent for a hundred blocks, so a reorganisation cannot leave already-spent rewards behind.",
    "example": "The genesis block's coinbase transaction carries a newspaper headline from January 2009 in its input field.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "coinjoin",
    "title": "CoinJoin",
    "definition": "A collaborative transaction in which many people contribute inputs and receive equal-sized outputs, so that which output belongs to whom is not visible on-chain. It breaks the link between coins and their history rather than hiding amounts, and it cannot undo links already published.",
    "example": "After a CoinJoin, an observer sees many indistinguishable outputs of the same size rather than one traceable payment.",
    "categories": [
      "Privacy"
    ]
  },
  {
    "id": "cold_storage",
    "title": "Cold storage",
    "definition": "Keeping the keys that authorise spending on something that has never been connected to the internet, and signing transactions without connecting it. The phrase describes where the keys are, not what product is used. It reduces exposure to malware and remote theft, and does nothing about losing the backup or being coerced.",
    "example": "A signing device kept in a drawer, paired with watch-only software on a laptop, is cold storage; the same device left plugged into a computer is not.",
    "categories": [
      "Storage",
      "Security",
      "Hardware Wallets"
    ]
  },
  {
    "id": "collaborative_custody",
    "title": "Collaborative custody",
    "definition": "A multisig arrangement where a company holds one key and you hold the others, so it can help you recover without being able to spend. It buys a recovery process and an inheritance path in exchange for a fee, an identifiable relationship, and a dependency on the company still existing.",
    "example": "In a 2-of-3 where you hold two keys, the company's participation is optional for spending and useful for recovery.",
    "categories": [
      "Multisig",
      "Planning",
      "Risk"
    ]
  },
  {
    "id": "common_input_ownership",
    "title": "Common-input-ownership",
    "definition": "The assumption that if a transaction spends several coins, one entity controlled all of them. It is the strongest heuristic in chain analysis and correct the overwhelming majority of the time. Coin control exists mostly to avoid triggering it, and PayJoin exists to make it produce wrong answers.",
    "example": "Spending two coins together publicly asserts they share an owner, permanently and without any way to withdraw the claim.",
    "categories": [
      "Privacy"
    ]
  },
  {
    "id": "confirmation",
    "title": "Confirmation",
    "definition": "A block containing your transaction, plus each block built on top of it. Confirmations are depth rather than a status change: nothing about the transaction is altered, but reversing it would require redoing every block since. There is no threshold at which a payment becomes official — how many to wait for is a judgement about the amount at stake.",
    "example": "An exchange might credit a small deposit at one confirmation and a large one at six.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "consensus_rules",
    "title": "Consensus rules",
    "definition": "The conditions every node checks before accepting a block — the supply schedule, signature validity, transaction format, and the rest. They are enforced independently by everyone running a node, which is why no single party can change them and why running one is what makes the rule yours rather than someone's promise.",
    "example": "A block creating more bitcoin than the schedule allows is rejected by each node on its own, not by a vote.",
    "categories": [
      "Technical",
      "Connectivity"
    ]
  },
  {
    "id": "consolidation",
    "title": "Consolidation",
    "definition": "Deliberately combining many small UTXOs into one, usually while fees are low, so a later payment does not need many inputs. It saves money and costs privacy: the combining transaction asserts that every input shared an owner, permanently and in public.",
    "example": "Consolidating a year of small purchases into one coin links them all, which may or may not matter depending on where they came from.",
    "categories": [
      "Privacy",
      "Wallets"
    ]
  },
  {
    "id": "coordinator",
    "title": "Coordinator",
    "definition": "The software that watches the blockchain, tracks balances and builds transactions for one or more signing devices to sign. It holds public keys only and cannot spend. In multisig it also holds the wallet configuration, which is the part no seed phrase contains and the part people forget to back up.",
    "example": "Sparrow acting as coordinator builds a PSBT, each device signs it in turn, and the coordinator broadcasts the result.",
    "categories": [
      "Wallets",
      "Multisig"
    ]
  },
  {
    "id": "counterparty_risk",
    "title": "Counterparty risk",
    "definition": "The risk that whoever owes you something fails to deliver — through insolvency, fraud, freezing your account, or simply ceasing to operate in your jurisdiction. It is the category of risk self-custody removes, and the reason \"not your keys, not your coins\" is a description rather than a slogan.",
    "example": "Every platform failure of the last decade was counterparty risk arriving, however differently each one looked from outside.",
    "categories": [
      "Risk",
      "Exchanges"
    ]
  },
  {
    "id": "custodial",
    "title": "Custodial",
    "definition": "An arrangement where a company holds the keys and you hold a claim. The balance shown is what the company says it owes you, not an observation of the chain. It can be convenient, and it makes their solvency, access policies and continued existence part of your risk.",
    "example": "An exchange balance is custodial until it is withdrawn to an address you control.",
    "categories": [
      "Exchanges",
      "Risk"
    ]
  },
  {
    "id": "dead_mans_switch",
    "title": "Dead man's switch",
    "definition": "An automated process that releases information if you stop checking in. Appealing in theory and unreliable in practice: services lapse, shut down, or fire early — and firing early discloses everything while you are alive and well. Worth having as one signal among several rather than as the plan.",
    "example": "A switch that triggers during a long holiday hands over your instructions at the worst possible moment.",
    "categories": [
      "Planning",
      "Risk"
    ]
  },
  {
    "id": "derivation_path",
    "title": "Derivation path",
    "definition": "The route from a wallet's master key down to one particular key, written as numbers separated by slashes — m/84'/0'/0'/0/0. Each step picks a child key, so one seed produces completely different addresses depending on the path taken. A wallet restored on the wrong path looks empty even though the recovery words were right.",
    "example": "Native SegWit wallets normally use m/84'/0'/0', so software expecting m/44'/0'/0' derives none of the same addresses from the same words.",
    "categories": [
      "Wallets",
      "Recovery",
      "Technical"
    ]
  },
  {
    "id": "difficulty",
    "title": "Difficulty",
    "definition": "How hard the network currently requires a valid block to be to find. It is recalculated every 2,016 blocks so that blocks keep arriving about every ten minutes regardless of how much mining power has joined or left.",
    "example": "More miners means blocks arrive faster, until the next adjustment raises difficulty and restores the pace.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "difficulty_adjustment",
    "title": "Difficulty adjustment",
    "definition": "The recalibration, every 2,016 blocks, of how hard it is to mine one — raising the target if blocks came too fast and lowering it if they came too slowly. It is what keeps the ten-minute average steady regardless of how much mining hardware joins or leaves, and what makes the issuance schedule hold to something close to its intended pace.",
    "example": "A large drop in mining activity is followed by an adjustment that makes blocks easier to find, restoring the pace.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "dollar_cost_averaging",
    "title": "Dollar cost averaging",
    "definition": "Buying a fixed amount at regular intervals rather than choosing moments. It removes timing decisions, which is most of its value. In self-custody terms it produces many small UTXOs, so it interacts with coin control and consolidation more than people expect.",
    "example": "A year of weekly buys leaves fifty-two separate coins, each of which may cost more to spend than it did to receive.",
    "categories": [
      "Planning",
      "Privacy"
    ]
  },
  {
    "id": "double_spend",
    "title": "Double spend",
    "definition": "Attempting to spend the same coin twice. Preventing it without a trusted referee is the problem bitcoin exists to solve: the chain establishes an order everyone can agree on, so only the first spend of a coin is valid. This is why confirmations matter and why a payment is not final on broadcast.",
    "example": "Accepting a zero-confirmation payment means trusting that no conflicting transaction is mined first.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "duress_pin",
    "title": "Duress PIN",
    "definition": "A second PIN that opens a decoy wallet, so something can be surrendered under coercion. It depends on the attacker believing you and stopping, which makes it a delay rather than a shield — and anyone informed enough to target you knows the feature exists.",
    "example": "A decoy holding a token amount is transparently a decoy; one holding enough to be believed is enough to hurt to lose.",
    "categories": [
      "Threats",
      "Hardware Wallets"
    ]
  },
  {
    "id": "dust",
    "title": "Dust",
    "definition": "A UTXO so small that spending it would cost more in fees than it is worth, leaving it economically stranded. Most dust is innocent — change, faucet payouts, leftovers. Some is deliberate: a dusting attack sends a trivial amount hoping you will later spend it alongside your other coins and link them. Freezing anything of unknown origin covers both cases.",
    "example": "A few hundred satoshis arriving unexpectedly is best frozen rather than swept up by automatic coin selection.",
    "categories": [
      "Privacy",
      "Threats",
      "Technical"
    ]
  },
  {
    "id": "entropy",
    "title": "Entropy",
    "definition": "Genuine unpredictability, measured in bits, and the raw material every wallet is built from. A seed is only as unguessable as the entropy behind it, which is why wallets are generated by a device or a physical process rather than chosen by a person. Human-invented phrases and passwords have been swept at scale for over a decade.",
    "example": "Rolling dice produces entropy that can be checked and reasoned about, rather than trusting a device's internal generator alone.",
    "categories": [
      "Technical",
      "Security",
      "Backups"
    ]
  },
  {
    "id": "evil_maid",
    "title": "Evil maid attack",
    "definition": "Tampering with a device left unattended — a hotel room, an office, a house someone else has access to — and returning it looking untouched. It is the reason physical possession of your hardware matters, and the reason a device you have lost sight of should be treated as suspect rather than merely inconvenient.",
    "example": "A signing device left in a hotel safe for a week should be verified or replaced rather than assumed intact.",
    "categories": [
      "Threats",
      "Security"
    ]
  },
  {
    "id": "xpub",
    "title": "Extended public key (xpub)",
    "definition": "A public key plus a chain code, which together allow every address below a point in a wallet's tree to be derived without any ability to spend. It is what makes watch-only wallets possible. It is not secret in the way a seed is, but it reveals every address in that account, past and future, so anyone holding it can see the whole balance and history permanently.",
    "example": "Importing an xpub into desktop software lets it track a hardware wallet's balance while the keys stay on the device.",
    "categories": [
      "Technical",
      "Wallets",
      "Privacy"
    ]
  },
  {
    "id": "fee_rate",
    "title": "Fee rate",
    "definition": "What a transaction pays per unit of the space it occupies, quoted in satoshis per virtual byte. Miners select by rate rather than by total fee, so a small transaction paying a high rate confirms ahead of a large one paying more in absolute terms. It is the number that decides how long you wait.",
    "example": "A transaction with many inputs is physically larger, so matching someone else's fee rate costs it more in total.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "fiat",
    "title": "Fiat currency",
    "definition": "Money that is money because an authority declares it so, rather than because it is redeemable for something else. Every major national currency works this way. The arrangement is not inherently dishonest — it allows a supply that responds to circumstance — but it places the decision about how much exists with an issuer rather than with a fixed rule.",
    "example": "Canadian dollars are not redeemable for any commodity; their value rests on their acceptance and on confidence in the issuer.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "firmware",
    "title": "Firmware",
    "definition": "The software running on a signing device. It decides what the screen shows and what the device will sign, so its provenance matters as much as the hardware's. Verifying a release signature before flashing defeats a substituted download; it does not tell you the vendor should be trusted.",
    "example": "Checking a firmware signature against a key you have used for years is meaningfully stronger than against one fetched minutes ago.",
    "categories": [
      "Firmware",
      "Security"
    ]
  },
  {
    "id": "full_node",
    "title": "Full node",
    "definition": "Software that downloads every block and checks it against the consensus rules itself, rather than trusting anyone's summary. Running one is what lets a wallet answer questions from rules you enforce instead of a stranger's server. Installing one is not the same as using one — most wallets also need an index server alongside it before they can query addresses.",
    "example": "A node that validates the chain in a cupboard changes nothing about privacy until the wallet is actually configured to talk to it.",
    "categories": [
      "Connectivity",
      "Privacy",
      "Technical"
    ]
  },
  {
    "id": "fungibility",
    "title": "Fungibility",
    "definition": "The property of units being interchangeable, so that one is as acceptable as any other. Bitcoin is fungible at the protocol level — no rule treats one coin differently — and imperfectly fungible in practice, because the ledger is public and history can be traced. A coin whose past a service dislikes may be refused even though the network makes no distinction.",
    "example": "An exchange declining a deposit because of where the coins previously sat is a failure of fungibility in practice, not in the protocol.",
    "categories": [
      "Privacy",
      "Technical"
    ]
  },
  {
    "id": "gap_limit",
    "title": "Gap limit",
    "definition": "How many consecutive unused addresses a wallet checks before concluding there is nothing further. BIP44 sets it at twenty. It exists so restoring does not take forever, and it produces a specific failure: coins received beyond a long run of unused addresses look missing until the limit is raised and the wallet rescans.",
    "example": "Generating dozens of addresses without using them can push a later payment past the default gap, so a restore shows a zero balance.",
    "categories": [
      "Recovery",
      "Wallets",
      "Technical"
    ]
  },
  {
    "id": "genesis_block",
    "title": "Genesis block",
    "definition": "The first block, mined in January 2009. Its coinbase output is unspendable by a quirk of the original code, and its input carries a newspaper headline about bank bailouts — a timestamp and, most read it, a statement of purpose.",
    "example": "Block height counts from the genesis block at zero.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "gold_standard",
    "title": "Gold standard",
    "definition": "A monetary arrangement in which a currency is redeemable for a fixed quantity of gold. It constrained issuance by tying it to something that could not be produced at will, and it was abandoned in stages during the twentieth century. It is referenced in bitcoin discussion as the nearest widely-understood precedent for a money with a supply rule.",
    "example": "Under a gold standard a note was a claim on metal; the constraint held only while redemption was honoured.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "halving",
    "title": "Halving",
    "definition": "The scheduled reduction of the block subsidy by half, every 210,000 blocks or roughly four years. It is the mechanism that produces bitcoin's issuance curve and, eventually, its cap: each halving reduces new supply until the subsidy rounds to nothing. Nothing is decided at the time — the schedule was fixed at the start and every node enforces it.",
    "example": "The subsidy fell from 6.25 to 3.125 bitcoin in 2024, the fourth such reduction.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "hard_cap",
    "title": "Hard cap",
    "definition": "The limit of just under 21 million bitcoin that will ever exist. It is not a policy anyone announces or could raise by agreement; it falls out of the halving schedule, and it holds because every node independently rejects a block that creates more than the rules allow. Changing it would require the people enforcing the rule to choose to stop.",
    "example": "A miner producing a block with an oversized subsidy has that block rejected by the network rather than debated.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "hard_fork",
    "title": "Hard fork",
    "definition": "A rule change that loosens what is valid, so blocks made under the new rules are rejected by nodes running the old software. It splits the network unless everyone upgrades, which is why it is avoided for ordinary upgrades and why proposals that need one face a much higher bar.",
    "example": "Raising the supply cap would require a hard fork, and nodes enforcing the old rule would simply reject the blocks.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "hardened_derivation",
    "title": "Hardened derivation",
    "definition": "A derivation step, written with an apostrophe as 84', that can only be performed with the private key. It exists to contain a specific leak: an extended public key plus any ordinary child private key beneath it reconstructs the parent private key. Hardening the account level makes an exported xpub safe to share.",
    "example": "In m/84'/0'/0'/0/0 the first three steps are hardened and the last two are not, which is what lets a watch-only wallet derive addresses but never walk upwards.",
    "categories": [
      "Technical",
      "Security"
    ]
  },
  {
    "id": "hardware_wallet",
    "title": "Hardware wallet",
    "definition": "A dedicated device holding private keys and signing transactions, more accurately called a signing device since it holds no bitcoin. Its value is structural: the keys never reach a general-purpose computer, and it has a screen the computer cannot rewrite, which is where addresses and amounts should be read.",
    "example": "The point of the device is not that it is unhackable, but that verifying an address on its own screen defeats malware on the machine driving it.",
    "categories": [
      "Hardware Wallets",
      "Security"
    ]
  },
  {
    "id": "hash_rate",
    "title": "Hash rate",
    "definition": "How much computation the network is applying to mining, and therefore how expensive rewriting recent history would be. It moves with hardware, energy prices and the bitcoin price, and the difficulty adjustment absorbs those changes so block timing stays roughly steady.",
    "example": "A sharp fall in hash rate slows blocks until the next difficulty adjustment brings the pace back.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "hd_wallet",
    "title": "HD wallet",
    "definition": "A hierarchical deterministic wallet: one seed, from which an unlimited tree of keys is derived by a fixed procedure. Deterministic is the useful half — nothing is random after the seed, so the same words rebuild the same keys anywhere. Hierarchical is why a single backup covers thousands of addresses.",
    "example": "Because the wallet is HD, generating a fresh receiving address for every payment costs nothing and needs no new backup.",
    "categories": [
      "Technical",
      "Wallets",
      "Recovery"
    ]
  },
  {
    "id": "hot_wallet",
    "title": "Hot wallet",
    "definition": "A wallet whose spending keys live on an internet-connected device, usually a phone or laptop. Convenience is the point, and the trade is that anything compromising the device can reach the keys. The usual advice is not to avoid one but to bound it: keep an amount you would be annoyed rather than devastated to lose.",
    "example": "A phone wallet used for everyday spending is a hot wallet, which is why the savings sit on separate hardware.",
    "categories": [
      "Wallets",
      "Storage",
      "Risk"
    ]
  },
  {
    "id": "index_server",
    "title": "Index server",
    "definition": "Software that sits beside a full node and maintains an address index so wallets can ask what a given address holds — a question Bitcoin Core is not built to answer quickly. electrs, Fulcrum and ElectrumX are the common implementations, and node distributions bundle one, which is much of why they exist.",
    "example": "Pointing a wallet at your own node usually means pointing it at the index server running alongside it.",
    "categories": [
      "Connectivity",
      "Technical"
    ]
  },
  {
    "id": "inflation",
    "title": "Inflation",
    "definition": "A general rise in prices, equivalently a fall in what a unit of money buys. The word is used for two different things — an expansion of the money supply, and the price rises that may follow — and arguments frequently turn on which is meant. In bitcoin the supply side of that is fixed and public, which is what the term is usually invoking here.",
    "example": "Bitcoin's issuance rate is often called its inflation rate, and it falls at every halving regardless of demand.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "inheritance_plan",
    "title": "Inheritance plan",
    "definition": "An arrangement letting someone reach your bitcoin after you die without letting anyone reach it before. The two requirements pull against each other, which is most of what makes the subject hard. The commonest total loss is not theft but an heir who cannot execute a technically perfect plan.",
    "example": "Testing the plan with the person who will have to follow it is the only thing that turns a document you hope works into one you know does.",
    "categories": [
      "Planning",
      "Recovery"
    ]
  },
  {
    "id": "kyc",
    "title": "KYC",
    "definition": "Know your customer — the identity checks a regulated platform performs before letting you trade. It ties your legal identity to the specific coins you withdraw, and no on-chain technique reaches backwards through that link. It is the reason privacy work is about the future rather than the past.",
    "example": "Coins withdrawn from a verified account are associated with your identity in that platform's records regardless of what you do next.",
    "categories": [
      "Privacy",
      "Exchanges"
    ]
  },
  {
    "id": "legal_tender",
    "title": "Legal tender",
    "definition": "A legal status meaning a currency must be accepted in settlement of a debt within a jurisdiction. It is narrower than it sounds: it governs the discharge of debts rather than compelling anyone to accept a payment, and it says nothing about whether a currency holds value. A money can be legal tender and be losing purchasing power quickly.",
    "example": "Legal tender status obliges a creditor to accept the currency for a debt; it does not oblige a shop to price in it.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "locktime",
    "title": "Locktime",
    "definition": "A field stating the earliest block height or time at which a transaction may be included. Set to zero it means immediately. Wallets sometimes set it to the current height to discourage fee sniping, and that choice is one of the details that identifies which software built a transaction.",
    "example": "A transaction with a future locktime is valid but unminable until the chain reaches it.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "low_time_preference",
    "title": "Low time preference",
    "definition": "A disposition to weigh future outcomes heavily against immediate ones — saving rather than spending, building rather than extracting. The term is borrowed from economics into bitcoin discussion, where it is used both descriptively and as encouragement. Its practical form in self-custody is unglamorous: testing a backup before it is needed rather than after.",
    "example": "Spending an afternoon rehearsing a recovery you may never use is a low time preference act.",
    "categories": [
      "Planning"
    ]
  },
  {
    "id": "master_fingerprint",
    "title": "Master fingerprint",
    "definition": "Eight hexadecimal characters identifying which wallet a device is holding, taken from a hash of the wallet's master public key. It reveals nothing that could spend, and appears in descriptors and partly signed transactions to record which key signed or still has to. Because it comes from the seed, adding a BIP39 passphrase changes it — which is how you confirm a passphrase was entered the way you meant.",
    "example": "A multisig coordinator lists each cosigner by master fingerprint, so a 2-of-3 shows three eight-character identifiers rather than three extended public keys.",
    "categories": [
      "Wallets",
      "Multisig",
      "Recovery",
      "Technical"
    ]
  },
  {
    "id": "master_key",
    "title": "Master key",
    "definition": "The key at the root of a wallet's tree, derived from the seed and the ancestor of every other key in it. Everything below it can be recomputed from it, which is why it is never exported directly and why an extended public key is taken from an account below it instead.",
    "example": "A device reports a master key fingerprint so software can confirm it is talking to the wallet it thinks it is.",
    "categories": [
      "Technical",
      "Wallets"
    ]
  },
  {
    "id": "mempool",
    "title": "Mempool",
    "definition": "The set of valid transactions a node has heard about and is holding until one is mined. There is no single mempool — each node keeps its own, and they differ. A transaction sitting there is not stuck in any official sense; it is simply bidding below the going rate for block space, and it can be replaced or bumped rather than waited out.",
    "example": "Checking the mempool during a busy period shows whether a pending payment is underpriced or merely recent.",
    "categories": [
      "Technical",
      "Connectivity"
    ]
  },
  {
    "id": "merkle_tree",
    "title": "Merkle tree",
    "definition": "A structure that hashes transactions in pairs, repeatedly, until one hash summarises them all. It lets a block commit to its contents compactly, and lets a light client be shown that one transaction is in a block without downloading the whole thing.",
    "example": "A block header carries a single Merkle root standing in for every transaction the block contains.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "microsd_backup",
    "title": "MicroSD backup",
    "definition": "A backup file or wallet record stored on a removable MicroSD card. Hardware wallets may use MicroSD cards to move PSBTs, export wallet data, install firmware, or save an encrypted device backup without connecting the signer directly to an online computer. What the card contains—and whether it is encrypted—depends on the device and workflow.",
    "example": "A COLDCARD can save an encrypted backup containing its seed and settings to a MicroSD card; the backup file and its separate password are both required for recovery.",
    "categories": [
      "Hardware Wallets",
      "Backups",
      "Recovery",
      "Storage"
    ]
  },
  {
    "id": "mining",
    "title": "Mining",
    "definition": "Repeatedly hashing a candidate block until the result falls below a target, which is expensive by design. The expense is the point: it makes rewriting history costly rather than merely disallowed, and it decides the order of transactions without anyone being in charge.",
    "example": "A miner that finds a valid block collects the subsidy and the fees of the transactions it included.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "miniscript",
    "title": "Miniscript",
    "definition": "A structured way of writing spending conditions that software can analyse — checking what a policy allows, what it costs to satisfy, and whether it can be signed — rather than treating the script as an opaque blob. It is what makes complex arrangements like decaying multisig practical to build and audit.",
    "example": "A policy allowing three keys now, or two keys after a year, is expressible and checkable in Miniscript.",
    "categories": [
      "Technical",
      "Multisig"
    ]
  },
  {
    "id": "mobile_wallet",
    "title": "Mobile wallet",
    "definition": "A bitcoin wallet running as a phone app. Most hold their own keys and are therefore hot wallets, though some operate purely as watch-only companions to a hardware signer, and some are custodial. Which of the three a given app is matters more than any feature it advertises, and is not always obvious from its marketing.",
    "example": "The same phone can run a small hot wallet for spending and a separate watch-only wallet that tracks cold storage without being able to spend from it.",
    "categories": [
      "Wallets",
      "Storage"
    ]
  },
  {
    "id": "multisig",
    "title": "Multisig",
    "definition": "A wallet whose spending conditions require signatures from more than one key — commonly two of three. Losing one key or having one stolen changes nothing, which removes the single point of failure an ordinary wallet has. It adds a dependency in exchange: rebuilding the wallet needs its configuration as well as its keys, and no seed phrase contains that.",
    "example": "In a 2-of-3 held across three locations, a burglary at one of them yields a key that cannot move anything on its own.",
    "categories": [
      "Multisig",
      "Security",
      "Wallets"
    ]
  },
  {
    "id": "nfc",
    "title": "NFC",
    "definition": "Near Field Communication: a very short-range wireless technology that exchanges data when compatible devices are brought within a few centimetres of each other. Bitcoin devices and keycards may use NFC to transfer wallet data or approve actions, but NFC is still a communication channel and should not automatically be treated as an air gap.",
    "example": "A user taps an NFC keycard against a phone to authorize a wallet operation without plugging in a cable.",
    "categories": [
      "Hardware Wallets",
      "Connectivity",
      "Technical"
    ]
  },
  {
    "id": "node",
    "title": "Node",
    "definition": "Software that connects to the bitcoin network. A full node downloads every block and validates it against the consensus rules itself; a light client asks someone else and believes the answer. Which one your wallet talks to determines whether your balance is verified or reported.",
    "example": "Running a node changes nothing until the wallet is actually configured to use it rather than a public server.",
    "categories": [
      "Connectivity",
      "Technical"
    ]
  },
  {
    "id": "nonce",
    "title": "Nonce",
    "definition": "A number used once. Two unrelated things carry the name: the random value in an ECDSA signature, which must never repeat because reusing it across two signatures exposes the private key; and the field miners increment while searching for a valid block. Only the first is a security concern for a wallet.",
    "example": "Signature nonce reuse has drained real wallets, which is why the value is derived deterministically in modern implementations.",
    "categories": [
      "Technical",
      "Security"
    ]
  },
  {
    "id": "not_your_keys",
    "title": "Not your keys, not your coins",
    "definition": "The observation that bitcoin held by someone else is their asset and your claim. It is not an ideological slogan but a description of who bears the loss when a company fails — and of who can freeze, delay or lose your access while it operates normally.",
    "example": "Every customer of a failed platform believed their balance was their bitcoin, and the screen was accurate until it was not.",
    "categories": [
      "Risk",
      "Storage"
    ]
  },
  {
    "id": "open_source",
    "title": "Open source",
    "definition": "Source code published under a licence that permits anyone to read, modify and redistribute it. It makes a design auditable rather than audited — publication is not review, and a backdoor introduced by a trusted maintainer sits in public code that compiles reproducibly. Meaningful, and not on its own a guarantee.",
    "example": "A device with open firmware can have its published source compiled and compared against the binary that shipped, which closed firmware cannot.",
    "categories": [
      "Open Source",
      "Firmware",
      "Security"
    ]
  },
  {
    "id": "p2pkh",
    "title": "P2PKH",
    "definition": "Pay to public key hash — the original address format, beginning with 1. Universally accepted and the most expensive to spend from, because it carries no SegWit discount. Still perfectly valid; coins sitting on these addresses are not at risk, only slightly costlier to move.",
    "example": "An address starting with 1 is legacy, derived at m/44'/0'/0' in most wallets.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "p2sh",
    "title": "P2SH",
    "definition": "Pay to script hash — an address beginning with 3 that commits to a script rather than a key, revealed only when spent. It made complex conditions practical and was later used to wrap SegWit for compatibility, so a 3-address may be a multisig, a wrapped SegWit wallet, or something else entirely.",
    "example": "Wrapped SegWit wallets produce 3-addresses that older software accepts while still getting part of the SegWit discount.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "p2tr",
    "title": "P2TR",
    "definition": "Taproot outputs, addressed in bech32m and beginning bc1p. Cheapest to spend from for simple cases, and able to hide complex spending conditions so that an ordinary-looking spend reveals nothing about the alternatives that existed. Support is broad but still short of universal.",
    "example": "A bc1p address can conceal a multisig or timelocked fallback that is never used and never published.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "p2wpkh",
    "title": "P2WPKH",
    "definition": "Native SegWit single-key outputs, addressed in bech32 and beginning bc1q. Cheaper to spend from than legacy or wrapped forms, and the common default in current wallets. Acceptance is near-universal now, though a small number of services still lag.",
    "example": "A bc1q address derived at m/84'/0'/0' is the default for most wallets created today.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "p2wsh",
    "title": "P2WSH",
    "definition": "Native SegWit outputs that commit to a script rather than a single key, beginning bc1q but longer than the single-key form. It is the usual shape of a modern multisig wallet.",
    "example": "A 2-of-3 native SegWit multisig pays to P2WSH addresses derived from all three co-signers' keys.",
    "categories": [
      "Technical",
      "Multisig"
    ]
  },
  {
    "id": "passphrase",
    "title": "Passphrase",
    "definition": "An optional secret combined with a wallet backup to derive a different wallet. Under BIP39, every passphrase—including an empty or incorrect one—produces a valid wallet, so there is no error message that can identify the right one. The same recovery words and exact passphrase are both required to restore the intended wallet.",
    "example": "Restoring the correct recovery words with a misspelled passphrase opens a different, usually empty wallet rather than reporting a mistake.",
    "categories": [
      "Wallets",
      "Security",
      "Recovery",
      "BIP39"
    ]
  },
  {
    "id": "payjoin",
    "title": "PayJoin",
    "definition": "A payment in which the recipient also contributes an input, so the finished transaction spends coins belonging to two different people. Anyone applying common-input-ownership to it concludes one entity owned both and is simply wrong. It looks like an ordinary transaction, and every one that happens degrades the heuristic for everybody.",
    "example": "A PayJoin also breaks amount analysis, because the visible payment amount is not the amount that changed hands.",
    "categories": [
      "Privacy"
    ]
  },
  {
    "id": "phishing",
    "title": "Phishing",
    "definition": "A social-engineering attack that impersonates a trusted person, company, website, or app to trick someone into revealing secrets or approving a harmful action. In Bitcoin, phishing commonly targets exchange credentials, recovery words, passphrases, wallet downloads, addresses, and transaction approvals.",
    "example": "A fake support message sends a user to a look-alike website that asks for recovery words to ‘verify’ a wallet.",
    "categories": [
      "Security",
      "Threats",
      "Exchanges"
    ]
  },
  {
    "id": "pin",
    "title": "PIN",
    "definition": "The code protecting a signing device from someone holding it. Its strength does not come from length — four digits is ten thousand guesses — but from something counting the wrong attempts and eventually acting. Where that counter lives is what a secure element is for.",
    "example": "A device that wipes itself after a set number of wrong PINs is behaving correctly; a counter that could be reset would be worthless.",
    "categories": [
      "Hardware Wallets",
      "Security"
    ]
  },
  {
    "id": "private_key",
    "title": "Private key",
    "definition": "The number that authorises spending. It is not a password and is never sent anywhere — a wallet proves it holds the key by producing a signature, and the key itself stays put. Anyone who learns it can spend the coins it controls, immediately and irreversibly, from anywhere.",
    "example": "A hardware wallet exists so the private key never touches an internet-connected computer, even while that computer builds the transaction.",
    "categories": [
      "Technical",
      "Wallets",
      "Security"
    ]
  },
  {
    "id": "proof_of_reserves",
    "title": "Proof of reserves",
    "definition": "A demonstration that a platform controls a quantity of bitcoin at a moment in time. Genuinely something, and not solvency: solvency is reserves minus liabilities, and the liabilities are the half nobody can see. It is a snapshot, it rarely proves what customers are owed, and it cannot show whether the coins are already pledged elsewhere.",
    "example": "Coins can be borrowed for an audit and returned afterwards, which has happened.",
    "categories": [
      "Exchanges",
      "Risk"
    ]
  },
  {
    "id": "proof_of_work",
    "title": "Proof of work",
    "definition": "Evidence that a large amount of computation was spent producing something, cheap for anyone to verify and expensive to fake. It is how bitcoin settles which history is real without a vote: rewriting a block means redoing its work and every block after it, faster than the rest of the network extends the chain.",
    "example": "Six confirmations means an attacker would have to redo six blocks of work while competing with everyone else.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "pruned_node",
    "title": "Pruned node",
    "definition": "A full node that validates every block and then discards old block data to save disk. It enforces the same rules and is a genuine full node, but it cannot serve historical blocks — which matters if you later need to rescan for a wallet with years of history.",
    "example": "Pruning keeps a node under a few hundred gigabytes, at the cost of being unable to rescan old blocks for an imported wallet.",
    "categories": [
      "Connectivity",
      "Technical"
    ]
  },
  {
    "id": "psbt",
    "title": "PSBT",
    "definition": "A partially signed bitcoin transaction — the file format an unsigned transaction travels in between the software that built it and the device that signs it. It carries the proposed transaction plus everything an offline signer needs to check the work independently, including the value of every input, so the device can compute the fee itself rather than believing a number the computer supplied.",
    "example": "An air-gapped signer reads a PSBT from a microSD card, displays the amount and fee it calculated, and writes the signed version back to the card.",
    "categories": [
      "Technical",
      "Hardware Wallets",
      "Multisig"
    ]
  },
  {
    "id": "public_key",
    "title": "Public key",
    "definition": "A number derived from a private key that can verify its signatures without being able to produce them. The derivation runs one way only: a public key reveals nothing usable about the private key behind it. Addresses are built from public keys, which is why sharing an address is safe and sharing a private key is not.",
    "example": "A watch-only wallet holds public keys, so it can recognise incoming payments and build transactions but cannot sign one.",
    "categories": [
      "Technical",
      "Wallets"
    ]
  },
  {
    "id": "receive_address",
    "title": "Receive address",
    "definition": "A string encoding the conditions under which a payment can later be spent. Wallets generate a fresh one for each payment, because reusing one publicly links every payment to it. The only trustworthy place to read one is the screen of the device holding the keys.",
    "example": "Verifying a receive address on the hardware wallet rather than the computer is what defeats malware that swaps addresses in the clipboard.",
    "categories": [
      "Wallets",
      "Security"
    ]
  },
  {
    "id": "seed_phrase",
    "title": "Recovery phrase",
    "definition": "The twelve or twenty-four words that encode a wallet's master secret. They are the wallet, not a password to it — anyone holding them holds the coins, and no company can reset or reissue them. Order matters, the wordlist matters, and a phrase written down wrongly is a wallet that no longer exists.",
    "example": "Restoring a phrase into different software rebuilds the same wallet, provided the derivation path and any passphrase match.",
    "categories": [
      "Backups",
      "Recovery",
      "BIP39"
    ]
  },
  {
    "id": "recovery_test",
    "title": "Recovery test",
    "definition": "Deliberately restoring a wallet from its backup, before the wallet holds anything you would miss, to prove the backup works. Everything else about a backup is an assumption until this has been done once. It is the step that most reliably separates people who have custody from people who have a wallet.",
    "example": "A backup that has never been restored is a guess, however carefully it was written.",
    "categories": [
      "Recovery",
      "Backups"
    ]
  },
  {
    "id": "reorg",
    "title": "Reorganisation",
    "definition": "When nodes switch to a different chain of blocks because it carries more work, discarding one or more blocks they had accepted. Short reorgs of a block happen occasionally and harmlessly. Deep ones do not occur naturally, which is why waiting for confirmations is meaningful.",
    "example": "A transaction confirmed once can be undone by a one-block reorg; one confirmed six times effectively cannot.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "replace_by_fee",
    "title": "Replace-by-fee (RBF)",
    "definition": "Replacing an unconfirmed transaction with a version paying a higher fee. It is the normal way to unstick a payment you sent, and it requires that the original signalled it was replaceable — a per-wallet default more than a per-user decision. The replacement must pay the same recipient the same amount to be useful.",
    "example": "A payment stuck at a low fee rate can be bumped by broadcasting a replacement paying more, which miners prefer.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "reproducible_firmware",
    "title": "Reproducible firmware",
    "definition": "Firmware whose published source code and documented build process can be independently rebuilt to produce the same binary distributed by the vendor. Matching builds provide evidence that the released firmware corresponds to the reviewed source, but they do not prove that the source itself is bug-free or safe.",
    "example": "Independent builders compile a hardware wallet's tagged source release and compare the resulting firmware hash with the vendor's download.",
    "categories": [
      "Hardware Wallets",
      "Open Source",
      "Security",
      "Firmware"
    ]
  },
  {
    "id": "satoshi",
    "title": "Satoshi",
    "definition": "The smallest unit bitcoin is divisible into: one hundred millionth of a bitcoin. Amounts are stored and transmitted in satoshis, and fee rates are quoted in them. Nobody needs to own a whole bitcoin, which is worth saying because unit bias leads people to think otherwise.",
    "example": "A fee rate of 12 sats per vByte on a 140-vByte transaction costs 1,680 satoshis.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "scarcity",
    "title": "Scarcity",
    "definition": "Limited supply that cannot be increased in response to demand. Most things called scarce are merely costly to produce, so a high enough price eventually calls forth more. Bitcoin's supply does not respond to price at all: a tenfold rise in value produces no additional issuance, because the schedule is enforced rather than chosen.",
    "example": "Higher gold prices eventually fund more mining and more gold; higher bitcoin prices fund more mining and the same issuance.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "script",
    "title": "Script",
    "definition": "The small stack-based language that expresses the conditions under which an output can be spent. Most outputs use one of a handful of standard patterns, so \"who holds this key\" is the usual condition — but the language allows others, including thresholds and time delays, which is what multisig and timelocked spending paths are built from.",
    "example": "A 2-of-3 multisig output is a script saying any two of these three keys may spend this.",
    "categories": [
      "Technical",
      "Multisig"
    ]
  },
  {
    "id": "script_type",
    "title": "Script type",
    "definition": "Which standard spending pattern an address commits to — legacy, wrapped SegWit, native SegWit or Taproot. It determines what the address looks like, what it costs to spend from, and which derivation path a wallet uses. Restoring a seed under the wrong script type produces a valid, empty wallet.",
    "example": "The same seed produces completely different addresses depending on whether the wallet is set to legacy or native SegWit.",
    "categories": [
      "Technical",
      "Recovery",
      "Wallets"
    ]
  },
  {
    "id": "secure_element",
    "title": "Secure element",
    "definition": "A tamper-resistant chip designed to store sensitive data and perform security-critical operations in an isolated environment. In a hardware wallet it may protect secrets, enforce PIN rules, or assist with signing, but its presence alone does not prove the entire device or firmware is secure.",
    "example": "A hardware wallet stores key material in a secure element while its main processor handles the display and user interface.",
    "categories": [
      "Hardware Wallets",
      "Security",
      "Technical"
    ]
  },
  {
    "id": "segwit",
    "title": "SegWit",
    "definition": "A 2017 upgrade that moved signature data to a separate part of the transaction and discounted it when measuring size. That made transactions cheaper to spend, fixed transaction malleability, and created room for later upgrades. It was activated as a soft fork, so nothing was forced on anyone.",
    "example": "Spending from a SegWit address costs less than spending the same value from a legacy one, because the signature data is discounted.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "self_custody",
    "title": "Self-custody",
    "definition": "Holding the keys to your own bitcoin, so no company's solvency, policy or continued existence sits between you and it. It removes counterparty risk and transfers a specific set of jobs — backups, verification, recovery, inheritance — that an institution had been doing quietly on your behalf.",
    "example": "Self-custody means there is no password reset, which is both the cost and the entire point.",
    "categories": [
      "Storage",
      "Planning"
    ]
  },
  {
    "id": "shamir_backup",
    "title": "Shamir backup",
    "definition": "A threshold backup method, commonly implemented for wallets as SLIP39, that divides a master secret into multiple unique recovery shares. A chosen minimum number of shares can reconstruct the wallet; fewer than that threshold do not reveal the master secret. SLIP39 shares are not ordinary BIP39 recovery words and require compatible recovery software or hardware.",
    "example": "With a 2-of-3 Shamir backup, any two of the three shares can recover the wallet, while one share alone is insufficient.",
    "categories": [
      "Backups",
      "Recovery",
      "Security",
      "SLIP39"
    ]
  },
  {
    "id": "signature",
    "title": "Signature",
    "definition": "Proof that the holder of a private key authorised a specific transaction, verifiable by anyone holding the matching public key. It commits to the transaction's contents, so altering any detail invalidates it. Producing one is the only thing a private key is ever used for.",
    "example": "A signing device adds its signature to a PSBT and hands it back; the key itself never leaves.",
    "categories": [
      "Technical",
      "Security"
    ]
  },
  {
    "id": "signing_device",
    "title": "Signing device",
    "definition": "A dedicated device that holds private keys and signs transactions, commonly called a hardware wallet. The name is more accurate: it does not hold bitcoin and usually cannot see the blockchain. Its value is that the keys never reach a general-purpose computer, and that it has a screen the computer cannot rewrite.",
    "example": "The computer proposes a transaction and the signing device disposes, displaying the details on its own screen before approving.",
    "categories": [
      "Hardware Wallets",
      "Security"
    ]
  },
  {
    "id": "silent_payments",
    "title": "Silent payments",
    "definition": "A scheme letting one published address produce a unique, unlinkable on-chain output for every sender. It solves the specific problem of needing a static address — a donation page, a profile — without the address reuse that would otherwise create. The cost is that the recipient's wallet must scan blocks to find its payments.",
    "example": "A single published silent payment address receives many payments that nothing on the chain connects to each other.",
    "categories": [
      "Privacy"
    ]
  },
  {
    "id": "sim_swap",
    "title": "SIM swap",
    "definition": "An account-takeover attack in which a criminal causes a mobile carrier to move a victim's phone number to a SIM or device the criminal controls. Calls and text messages—including SMS login codes—can then be intercepted, which is why SMS should not be the strongest protection on an exchange account.",
    "example": "An attacker takes over a phone number, resets an exchange password, and receives the exchange's SMS verification code.",
    "categories": [
      "Security",
      "Threats",
      "Exchanges",
      "2FA"
    ]
  },
  {
    "id": "slip132",
    "title": "SLIP-132",
    "definition": "A registry of alternative version bytes that make an extended key's prefix announce its intended address type — ypub for wrapped SegWit, zpub for native SegWit, and capitalised forms for multisig. The key material is identical; only four bytes of packaging differ. Descriptors were designed to make the convention unnecessary.",
    "example": "Software rejecting a zpub usually wants the same key expressed as an xpub with an explicit derivation path.",
    "categories": [
      "Technical",
      "Wallets"
    ]
  },
  {
    "id": "social_engineering",
    "title": "Social engineering",
    "definition": "Attacking the person rather than the system — fake support staff, urgent messages, convincing impersonation. It is by a wide margin the most common way people lose bitcoin. The single reliable defence is a rule rather than judgement: nobody legitimate ever needs your recovery words, and nobody who contacts you first should be trusted.",
    "example": "A message claiming your device needs its phrase re-entered for a firmware issue is the whole attack.",
    "categories": [
      "Threats",
      "Security"
    ]
  },
  {
    "id": "soft_fork",
    "title": "Soft fork",
    "definition": "A rule change that tightens what is valid, so blocks made under the new rules are still accepted by nodes running the old software. It is the backwards-compatible way to upgrade and how SegWit and Taproot were activated. Nobody is forced to upgrade on any particular day.",
    "example": "A node that never upgraded still follows the chain after a soft fork, simply without enforcing the new rule.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "sound_money",
    "title": "Sound money",
    "definition": "Money whose supply cannot be expanded at the discretion of whoever issues it. The term comes from the argument that monies fail in a repeating pattern — they work until someone discovers how to make more cheaply, at which point holders lose value they had no part in deciding. What counts as sound is a claim about who controls issuance, not about price stability.",
    "example": "Glass beads worked as money until industrial production made them cheap to manufacture, which is the failure the term describes.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "spv",
    "title": "SPV",
    "definition": "Simplified payment verification: checking that a transaction appears in a block with sufficient work behind it, without validating the whole chain. It is how most light wallets work. The trade is that you verify inclusion rather than validity, and you generally reveal your addresses to whoever answers.",
    "example": "An SPV wallet learns that a payment was mined without checking whether the rules were followed throughout.",
    "categories": [
      "Connectivity",
      "Technical",
      "Privacy"
    ]
  },
  {
    "id": "orphan_block",
    "title": "Stale block",
    "definition": "A valid block that lost the race — two miners found one at nearly the same moment and the network converged on the other. The transactions in it are not lost; they return to mempools and are mined again. Often called an orphan block.",
    "example": "A brief fork resolves within a block or two, leaving one of the competing blocks stale.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "store_of_value",
    "title": "Store of value",
    "definition": "One of the jobs money does: holding purchasing power across time so that work done now can be spent later. It is a claim about durability rather than about price going up, and it is the function most sensitive to issuance — anything whose supply can be expanded cheaply tends to fail at it eventually, whatever else it does well.",
    "example": "A currency can work perfectly well for daily payments while failing as a store of value over a decade.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "supply_chain_attack",
    "title": "Supply chain attack",
    "definition": "Compromise introduced somewhere between manufacture and use — an intercepted parcel, a counterfeit unit, or a maintainer who spent years earning the right to publish releases. The three are different problems with different answers, and only multisig across vendors survives the case where the vendor is the problem.",
    "example": "The most costly version is not sophisticated: a device shipped with a pre-filled recovery sheet that is really the attacker's wallet.",
    "categories": [
      "Threats",
      "Security"
    ]
  },
  {
    "id": "sweep",
    "title": "Sweep",
    "definition": "Moving the entire balance controlled by a key into a different wallet, rather than importing the key and continuing to use it. Sweeping is the safe response to a key whose secrecy is uncertain, because it ends that key's relevance instead of relying on it.",
    "example": "A paper wallet or gift card should be swept into a wallet you generated, not imported and reused.",
    "categories": [
      "Recovery",
      "Security",
      "Wallets"
    ]
  },
  {
    "id": "taint",
    "title": "Taint",
    "definition": "The idea that a coin's history makes it more or less acceptable. The protocol makes no such distinction — every satoshi is identical to the rules — but services sometimes act on history anyway, which makes bitcoin imperfectly fungible in practice while remaining perfectly fungible in principle.",
    "example": "An exchange freezing a deposit because of where the coins previously sat is acting on taint, not on any protocol rule.",
    "categories": [
      "Privacy"
    ]
  },
  {
    "id": "tamper_evidence",
    "title": "Tamper evidence",
    "definition": "Packaging meant to show whether a device was opened before it reached you. Worth something and much less than its theatre suggests, since seals are manufactured goods an attacker who can source a device can usually source too. The defence that actually works is procedural: never accept a secret the device did not make while you watched.",
    "example": "A device arriving with recovery words already filled in is compromised regardless of how intact the packaging looks.",
    "categories": [
      "Threats",
      "Hardware Wallets"
    ]
  },
  {
    "id": "taproot",
    "title": "Taproot",
    "definition": "A 2021 upgrade introducing Schnorr signatures and a way to commit to several spending conditions while publishing only the one used. A multisig spent cooperatively can look identical to an ordinary single-key spend, which is a privacy improvement as well as a cost one.",
    "example": "Taproot lets a wallet keep an emergency recovery path that never appears on-chain unless it is actually needed.",
    "categories": [
      "Technical",
      "Privacy"
    ]
  },
  {
    "id": "test_transaction",
    "title": "Test transaction",
    "definition": "Sending a small amount along exactly the route you intend to use before committing the rest. It proves the address, the wallet, the device and your understanding of all three, at a cost of a few dollars and one confirmation. It is the cheapest point in the process at which being wrong is survivable.",
    "example": "The test is not a ritual for the nervous; it is the only step where a mistake costs five dollars instead of the balance.",
    "categories": [
      "Security",
      "Planning"
    ]
  },
  {
    "id": "threat_model",
    "title": "Threat model",
    "definition": "A structured assessment of what you are protecting, who or what could harm it, how likely those events are, and which safeguards address them. A useful Bitcoin threat model includes digital theft, physical loss, coercion, fire or flood, user error, privacy leakage, and the people who may need to recover the wallet.",
    "example": "Someone living alone may prioritize recoverability and inheritance differently from a public figure who faces targeted physical threats.",
    "categories": [
      "Security",
      "Planning",
      "Risk"
    ]
  },
  {
    "id": "timelock",
    "title": "Timelock",
    "definition": "A spending condition that cannot be satisfied before a stated block height or elapsed time, enforced by every node rather than by any wallet's promise. It is the mechanism behind inheritance paths that open after a delay, and behind arrangements that make immediate transfer genuinely impossible.",
    "example": "Coins locked until a future height cannot be moved by anyone, including under coercion, until the chain reaches it.",
    "categories": [
      "Technical",
      "Planning",
      "Threats"
    ]
  },
  {
    "id": "tor",
    "title": "Tor",
    "definition": "A network that routes traffic through several relays so the destination does not learn your address. Wallets use it to reach a node without exposing a home connection, and node software can publish an index server as a hidden service so a phone can reach it from anywhere without opening anything to the internet.",
    "example": "Connecting a phone wallet to a home node over Tor avoids both port forwarding and revealing where the queries come from.",
    "categories": [
      "Privacy",
      "Connectivity"
    ]
  },
  {
    "id": "transaction",
    "title": "Transaction",
    "definition": "A signed instruction that consumes existing UTXOs and creates new ones. It does not move an object; it retires some spending conditions and writes new ones. The fee is not a field in it — it is whatever the inputs exceed the outputs by, which is why a device that cannot see input values cannot tell you what a transaction really costs.",
    "example": "Paying someone from a single large coin produces two outputs: theirs, and the change returning to an address of your own.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "two_factor_authentication_2fa",
    "title": "Two-factor authentication (2FA)",
    "definition": "Requiring a second proof of identity beyond a password, typically a code from an app or a hardware security key. It protects accounts, not bitcoin you hold yourself — there is no account to log in to in self-custody. Not all second factors are equal: codes sent by SMS can be redirected by a SIM swap and are the weakest option commonly offered.",
    "example": "Moving an exchange account from SMS codes to an authenticator app removes the SIM swap route entirely.",
    "categories": [
      "2FA",
      "Exchanges",
      "Security"
    ]
  },
  {
    "id": "unconfirmed",
    "title": "Unconfirmed",
    "definition": "Broadcast but not yet included in a block. The money has left your available balance because the inputs are committed, but nothing is settled and nothing is lost. An unconfirmed transaction is usually underpriced rather than stuck, and can be replaced or bumped.",
    "example": "An unconfirmed payment showing on an explorer after several hours is bidding below the current fee rate.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "unit_bias",
    "title": "Unit bias",
    "definition": "Judging value by the number of units rather than what they are worth, and concluding that something priced in whole numbers is cheap. It leads people to think a whole bitcoin is the meaningful quantity. Bitcoin divides into a hundred million satoshis, and owning a fraction is the normal case.",
    "example": "Buying twenty dollars of bitcoin is a perfectly ordinary transaction and not a consolation prize.",
    "categories": [
      "Risk"
    ]
  },
  {
    "id": "utxo",
    "title": "UTXO",
    "definition": "An unspent transaction output — one discrete chunk of bitcoin, of a particular size, spendable by whoever satisfies the conditions attached to it. A wallet's balance is not a number held anywhere; it is the sum of the UTXOs it can spend. Chunks are spent whole, so paying part of one produces change, and choosing which chunks to spend together is what coin control means.",
    "example": "A wallet showing 0.4 BTC might hold one UTXO of 0.35 and two of 0.025, which is why a small payment can require moving the largest of them.",
    "categories": [
      "Technical",
      "Wallets",
      "Privacy"
    ]
  },
  {
    "id": "virtual_byte",
    "title": "Virtual byte (vByte)",
    "definition": "The unit transaction size is measured in for fee purposes. SegWit data is discounted, so a transaction's virtual size is smaller than its raw byte count — which is the mechanism by which SegWit and Taproot addresses cost less to spend from than legacy ones.",
    "example": "Fee estimates are quoted in sats per vByte, so the same fee rate costs less on a native SegWit input than a legacy one.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "descriptor",
    "title": "Wallet descriptor",
    "definition": "A structured description of a Bitcoin wallet's public keys, derivation paths, script type, and spending policy. Also called an output descriptor, it lets compatible software reconstruct addresses and coordinate or watch the wallet without containing the private keys required to spend.",
    "example": "A multisig backup includes the wallet descriptor so compatible software can rebuild the same 2-of-3 policy and derive the same addresses.",
    "categories": [
      "Wallets",
      "Recovery",
      "Multisig",
      "Technical"
    ]
  },
  {
    "id": "wallet_fingerprinting",
    "title": "Wallet fingerprinting",
    "definition": "Identifying which software built a transaction from the choices it makes — locktime, version number, input ordering, RBF signalling, where change is placed. The pattern is consistent per wallet and leaks without any user action. No amount of careful coin selection affects it.",
    "example": "If the same fingerprint appears on the spending side and on one output, that output is probably the sender's change.",
    "categories": [
      "Privacy"
    ]
  },
  {
    "id": "watch_only_wallet",
    "title": "Watch-only wallet",
    "definition": "A wallet that tracks addresses, balances, and transactions without holding the private keys needed to spend. It can receive funds and usually construct unsigned transactions, but signing must happen in a separate wallet or hardware device. Importing an XPUB or descriptor can create a watch-only wallet while also exposing wallet history to the software or server used.",
    "example": "Sparrow on an online computer watches the wallet and prepares a PSBT; an offline hardware wallet reviews and signs it.",
    "categories": [
      "Wallets",
      "Security",
      "Privacy",
      "Technical"
    ]
  },
  {
    "id": "withdrawal",
    "title": "Withdrawal",
    "definition": "Moving bitcoin off a platform to an address you control. Until it happens, the balance shown is a claim against a company rather than coins you hold, and the platform's solvency and access policies are part of your risk. The step that makes it safe is verifying the destination address on your own device before sending the full amount.",
    "example": "Sending a small test amount first, confirming it arrives, and only then withdrawing the balance is the routine that catches a wrong address cheaply.",
    "categories": [
      "Exchanges",
      "Risk"
    ]
  },
  {
    "id": "witness",
    "title": "Witness",
    "definition": "The signature data separated out by SegWit. Keeping it apart from the rest of the transaction is what allowed the size discount and what removed transaction malleability, since altering a signature no longer changes the transaction's identifier.",
    "example": "A transaction's virtual size counts witness data at a quarter weight, which is where the SegWit saving comes from.",
    "categories": [
      "Technical"
    ]
  },
  {
    "id": "wordlist",
    "title": "Wordlist",
    "definition": "The fixed list of 2,048 words a recovery phrase draws from. Each word stands for exactly eleven bits, no two share their first four letters, and the list is language-specific — the same phrase written in a different language's wordlist produces an entirely unrelated wallet. Record which language was used.",
    "example": "Because prefixes are unique, stamping the first four letters of each word onto metal is a complete backup.",
    "categories": [
      "BIP39",
      "Backups",
      "Recovery"
    ]
  },
  {
    "id": "wrench_attack",
    "title": "Wrench attack",
    "definition": "An attack that bypasses cryptography entirely by coercing the owner into handing over their keys or moving funds. Also called the $5 wrench attack, after a well-known comic observing that an adversary is far more likely to threaten a person than to break their encryption. Because no key length or signing policy applies, the defences are different in kind: discretion about holdings, arrangements that make immediate transfer genuinely impossible, and keeping a small amount available to surrender.",
    "example": "A holder is confronted at home and forced to unlock a wallet; a mandatory login countdown means the funds cannot be moved that evening by anyone, including them.",
    "categories": [
      "Security",
      "Risk",
      "Planning"
    ]
  },
  {
    "id": "xprv",
    "title": "xprv",
    "definition": "An extended private key: a private key packaged with the chain code needed to derive every key beneath it. Whoever holds one can spend everything in that part of the wallet, so it should never be exported, photographed, or typed into software. Its public counterpart, the xpub, derives the same addresses but cannot spend from them.",
    "example": "Software that offers to export an xprv is offering the whole wallet — including every address it has not generated yet.",
    "categories": [
      "Wallets",
      "Security",
      "Technical"
    ]
  },
  {
    "id": "zpub",
    "title": "zpub",
    "definition": "An extended public key serialised with SLIP-132 version bytes indicating native SegWit. It is the same key as the equivalent xpub, wearing a prefix that tells the receiving wallet which address type to derive. Converting between the two moves no coins and changes no keys.",
    "example": "Importing a zpub into software that only accepts xpubs requires converting the prefix, not re-deriving the wallet.",
    "categories": [
      "Technical",
      "Wallets"
    ]
  }
];

export { glossaryTerms };

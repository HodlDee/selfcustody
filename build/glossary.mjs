/* The glossary, as data.

   These definitions are written for this site and licensed with the rest of its
   prose. The page used to fetch a wider lexicon from a third party at runtime,
   which meant the glossary went blank when that service was unreachable, put
   several hundred definitions the project had not written in front of readers,
   and carried no licence anyone could point at. Every term a guide links to now
   lives here instead.

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
    "id": "confirmation",
    "title": "Confirmation",
    "definition": "A block containing your transaction, plus each block built on top of it. Confirmations are depth rather than a status change: nothing about the transaction is altered, but reversing it would require redoing every block since. There is no threshold at which a payment becomes official — how many to wait for is a judgement about the amount at stake.",
    "example": "An exchange might credit a small deposit at one confirmation and a large one at six.",
    "categories": [
      "Technical"
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
    "id": "difficulty_adjustment",
    "title": "Difficulty adjustment",
    "definition": "The recalibration, every 2,016 blocks, of how hard it is to mine one — raising the target if blocks came too fast and lowering it if they came too slowly. It is what keeps the ten-minute average steady regardless of how much mining hardware joins or leaves, and what makes the issuance schedule hold to something close to its intended pace.",
    "example": "A large drop in mining activity is followed by an adjustment that makes blocks easier to find, restoring the pace.",
    "categories": [
      "Technical"
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
    "id": "fiat",
    "title": "Fiat currency",
    "definition": "Money that is money because an authority declares it so, rather than because it is redeemable for something else. Every major national currency works this way. The arrangement is not inherently dishonest — it allows a supply that responds to circumstance — but it places the decision about how much exists with an issuer rather than with a fixed rule.",
    "example": "Canadian dollars are not redeemable for any commodity; their value rests on their acceptance and on confidence in the issuer.",
    "categories": [
      "Technical"
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
    "id": "inflation",
    "title": "Inflation",
    "definition": "A general rise in prices, equivalently a fall in what a unit of money buys. The word is used for two different things — an expansion of the money supply, and the price rises that may follow — and arguments frequently turn on which is meant. In bitcoin the supply side of that is fixed and public, which is what the term is usually invoking here.",
    "example": "Bitcoin's issuance rate is often called its inflation rate, and it falls at every halving regardless of demand.",
    "categories": [
      "Technical"
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
    "id": "scarcity",
    "title": "Scarcity",
    "definition": "Limited supply that cannot be increased in response to demand. Most things called scarce are merely costly to produce, so a high enough price eventually calls forth more. Bitcoin's supply does not respond to price at all: a tenfold rise in value produces no additional issuance, because the schedule is enforced rather than chosen.",
    "example": "Higher gold prices eventually fund more mining and more gold; higher bitcoin prices fund more mining and the same issuance.",
    "categories": [
      "Technical"
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
    "id": "sound_money",
    "title": "Sound money",
    "definition": "Money whose supply cannot be expanded at the discretion of whoever issues it. The term comes from the argument that monies fail in a repeating pattern — they work until someone discovers how to make more cheaply, at which point holders lose value they had no part in deciding. What counts as sound is a claim about who controls issuance, not about price stability.",
    "example": "Glass beads worked as money until industrial production made them cheap to manufacture, which is the failure the term describes.",
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
  }
];

export { glossaryTerms };

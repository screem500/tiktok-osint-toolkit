# 🕵️ TikTok OSINT Toolkit

**[النسخة العربية 🇸🇦](README.ar.md)**

An open-source toolkit for extracting post links from **public** TikTok accounts directly in your browser — no installation required — with educational guides on Open Source Intelligence (OSINT) and digital forensics.

> ⚠️ **Legal notice**: This project is for **educational and research purposes only**, for use on public data or with explicit authorization. Read the [legal & ethical guidelines](docs/ethics_legal.en.md) before any use.

---

## 📁 Project Structure

```
tiktok-osint-toolkit/
├── README.md                          ← You are here (English)
├── README.ar.md                       ← النسخة العربية
├── LICENSE                            ← MIT License
├── CONTRIBUTING.md                    ← دليل المساهمة (عربي)
├── CONTRIBUTING.en.md                 ← Contribution guide (English)
├── scripts/
│   ├── tiktok_link_extractor.js       ← Basic script (single source of truth)
│   └── tiktok_link_extractor_advanced.js  ← Advanced: CSV (caption/author/sound) + timestamps
├── docs/
│   ├── osint.md / osint.en.md                     ← OSINT guide (AR / EN)
│   ├── digital_forensics.md / .en.md              ← Forensics fundamentals (AR / EN)
│   └── ethics_legal.md / ethics_legal.en.md       ← Legal & ethical guidelines (AR / EN)
└── social/
    ├── twitter_thread.md              ← Ready-to-post X thread (AR / EN)
    └── code_tweet.png                 ← Code image for social posts
```

> ⚠️ **Before pasting anything into the Console**: pasting code is the same technique abused by **Self-XSS scams** to steal sessions. The browser may ask you to type `allow pasting` first. Only run code taken **from this official repository**, and read it before running it.

---

## 🎯 The Reliable Method (Under 2 Minutes)

1. Open **Chrome** or **Firefox** on your computer.
2. Go to the target TikTok account (e.g., `https://www.tiktok.com/@username`).
3. Press `F12` (or `Ctrl+Shift+I`) to open Developer Tools.
4. Switch to the **Console** tab.
5. Copy the entire contents of [`scripts/tiktok_link_extractor.js`](scripts/tiktok_link_extractor.js).
6. Paste it into the console and press `Enter`.
7. Wait ~32 seconds (it auto-scrolls and collects links).
8. A text file downloads automatically, named after the account and the UTC collection time — e.g. `tiktok_username_2026-09-18_1305.txt`.

> 📌 **Coverage note**: the script only collects posts that actually load while scrolling (~20 scrolls in 30 seconds). Large accounts may not be fully covered — use the [advanced version](#-advanced-version), which keeps scrolling until no new content appears.

### Quick-Copy Code

The block below is **identical** to [`scripts/tiktok_link_extractor.js`](scripts/tiktok_link_extractor.js) — a single source of truth:

```javascript
/**
 * TikTok Link Extractor — Basic (v1.2.0)
 * ======================================
 * Usage: open a public profile → F12 → Console → paste → Enter,
 *        then wait ~32 seconds — the .txt file downloads automatically.
 *
 * Output: plain URLs, one per line — ready as a yt-dlp batch file.
 *         The file name carries the account and the UTC collection time,
 *         e.g. tiktok_username_2026-09-18_1305.txt
 *
 * Notice: public data, educational/research use only.
 * Arabic guide: README.ar.md
 */
(() => {
  const user = location.pathname.split('/')[1].toLowerCase();
  if (!user.startsWith('@')) {
    console.warn('Open a public profile page first.');
    return;
  }

  const posts = new Map(); // postId → url (dedupe by ID, merge URL variants)

  // file name = account + UTC collection time (no more tiktok_links(2).txt)
  const iso = new Date().toISOString();
  const stamp = `${iso.slice(0, 10)}_${iso.slice(11, 16).replace(':', '')}`;
  const safeUser = user.slice(1).replace(/[^\w.-]/g, '_');
  const fileName = `tiktok_${safeUser}_${stamp}.txt`;

  const collect = () => {
    document
      .querySelectorAll('a[href*="/video/"], a[href*="/photo/"]')
      .forEach((a) => {
        const m = a.href.match(/\/(@[^/?#]+)\/(video|photo)\/(\d+)/);
        // profile-only filter: reposts from other accounts are excluded
        if (!m || m[1].toLowerCase() !== user || posts.has(m[3])) return;
        posts.set(m[3], `https://www.tiktok.com/${m[1]}/${m[2]}/${m[3]}`);
      });
  };
  collect();

  const timer = setInterval(() => {
    collect();
    window.scrollBy(0, 1000);
  }, 1500);

  setTimeout(() => {
    clearInterval(timer); // stop scrolling first
    setTimeout(() => {
      collect(); // final pass — after the last batch has had 2s to load

      const blob = new Blob([[...posts.values()].join('\n')], {
        type: 'text/plain;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      console.log(`Collected ${posts.size} posts → ${fileName}`);
    }, 2000);
  }, 30000);
})();
```

📄 **Output**: plain URLs, one per line — the file works directly as a `yt-dlp` batch list. The file name carries the account and the UTC collection time, so repeated runs never overwrite each other and every file says which account it came from. Publish-time extraction lives in the advanced version's CSV.

### ✅ Why This Method Works

- Runs directly in your browser, scrolling at a gentle pace.
- Requires zero installation.
- Does **not** bypass any protection — it only reads links that are already visible in the page during your own session.

> 🛠️ **Technical notes** (v1.2.0): links are filtered to the profile you're viewing (so the Reposts tab can't mix in other accounts), posts are deduplicated by post ID, and a final collection pass runs after scrolling stops — earlier versions could miss the last-loaded posts. Output files are named `tiktok_<account>_<UTC date>_<HHMM>`.

---

## 🚀 Advanced Version

[`scripts/tiktok_link_extractor_advanced.js`](scripts/tiktok_link_extractor_advanced.js) adds:

- ⏹️ **Smart auto-stop** when no new posts appear — keeps scrolling until the profile ends (ideal for large accounts). **Keep the tab visible** while it runs — background tabs pause loading and may trigger an early stop.
- 📥 **Two files download** (TXT then CSV, ~1s apart): Chrome may ask you to **allow multiple downloads** — approve it or the CSV won't arrive.
- 🕒 **Publish-time extraction** from each post ID (first 32 bits = Unix timestamp).
- 📊 **CSV export** — columns: `url, created, caption, author, sound, alt_raw` (opens in Excel) alongside a plain-URLs TXT.
- 📁 **Self-describing file names**: `tiktok_<account>_<UTC date>_<HHMM>.txt` / `.csv` — no more `tiktok_links(2).txt`.
- 🛡️ **CSV-injection hardening**: cells starting with `= + - @` are prefixed with `'`, and quotes/newlines are escaped — captions are attacker-controlled text.
- 📝 Captures the **post title/caption** with each link when available.
- ⏱️ A 5-minute safety timeout to prevent infinite scrolling.

### 📄 Sample Output

TikTok keeps the caption inside the thumbnail's `alt` text, in the form
`<caption> created by <author> with <sound>`. The advanced script splits that into
separate columns and stores the untouched original in `alt_raw`:

```csv
url,created,caption,author,sound,alt_raw
"https://www.tiktok.com/@example/video/7474502610695851270","2025-02-23T06:47:33.000Z","Desert sunrise #travel","Example User","Example User's original sound","Desert sunrise #travel created by Example User with Example User's original sound"
"https://www.tiktok.com/@example/video/7443881082975440146","2024-12-02T18:20:23.000Z","","Example User","Example User's original sound","created by Example User with Example User's original sound"
```

An empty `caption` means the post has no description. All timestamps are **UTC**,
and `alt_raw` is kept unchanged so the split can always be verified against the
original text.

The TXT file next to it stays plain URLs, one per line:

```text
https://www.tiktok.com/@example/video/7474502610695851270
https://www.tiktok.com/@example/video/7443881082975440146
```

---

## 📚 Educational Guides

| Guide | Description |
|---|---|
| [🔎 OSINT Guide](docs/osint.en.md) ([عربي](docs/osint.md)) | What OSINT is, the intelligence cycle, and top free tools |
| [🔬 Digital Forensics](docs/digital_forensics.en.md) ([عربي](docs/digital_forensics.md)) | Core principles, chain of custody, and forensic analysis tools |
| [⚖️ Legal Guidelines](docs/ethics_legal.en.md) ([عربي](docs/ethics_legal.md)) | Boundaries of lawful use, privacy, and platform terms of service |

---

## 🤝 Contributing

Contributions are welcome! Read [CONTRIBUTING.en.md](CONTRIBUTING.en.md) ([عربي](CONTRIBUTING.md)) to learn how to suggest improvements or add new tools.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## ⭐ Support

If you found this useful, give it a star ⭐ on GitHub and share it with the cybersecurity and OSINT community.

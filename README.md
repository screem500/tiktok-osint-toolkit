# 🕵️ TikTok OSINT Toolkit

**[النسخة العربية 🇸🇦](README.ar.md)**

An open-source toolkit for extracting post links from **public** TikTok accounts directly in your browser — no installation required — with educational guides on Open Source Intelligence (OSINT) and digital forensics.

> ⚠️ **Legal notice**: This project is for **educational and research purposes only**, for use on public data or with explicit authorization. Read the [legal & ethical guidelines](docs/ethics_legal.md) before any use.

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
│   ├── tiktok_link_extractor.js       ← Basic script (bilingual comments)
│   └── tiktok_link_extractor_advanced.js  ← Advanced, CSV + metadata (bilingual)
└── docs/
    ├── osint.md / osint.en.md                     ← OSINT guide (AR / EN)
    ├── digital_forensics.md / .en.md              ← Forensics fundamentals (AR / EN)
    └── ethics_legal.md / ethics_legal.en.md       ← Legal & ethical guidelines (AR / EN)
```

---

## 🎯 The Reliable Method (Under 2 Minutes)

1. Open **Chrome** or **Firefox** on your computer.
2. Go to the target TikTok account (e.g., `https://www.tiktok.com/@username`).
3. Press `F12` (or `Ctrl+Shift+I`) to open Developer Tools.
4. Switch to the **Console** tab.
5. Copy the entire contents of [`scripts/tiktok_link_extractor.js`](scripts/tiktok_link_extractor.js).
6. Paste it into the console and press `Enter`.
7. Wait 30 seconds (it auto-scrolls and collects links).
8. A text file named `tiktok_links.txt` will download, containing all post links (videos and photos).

### Quick-Copy Code

```javascript
let links=[];
let timer=setInterval(()=>{
  document.querySelectorAll('a[href*="/video/"], a[href*="/photo/"]').forEach(a=>{
    if(a.href && !links.includes(a.href)) links.push(a.href);
  });
  window.scrollBy(0,1000);
},1500);
setTimeout(()=>{
  clearInterval(timer);
  let blob=new Blob([links.join('\n')],{type:'text/plain'});
  let a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='tiktok_links.txt';
  a.click();
  console.log('Extracted '+links.length+' links');
},30000);
```

### ✅ Why This Method Works

- Runs directly in your browser as if you were the real user.
- Requires zero installation.
- Executes inside your own browser session, so it doesn't interact with external protection systems.

> 🛠️ **Technical note**: The version commonly shared in tutorials has a small bug — calling `clearInterval()` without a timer ID never actually stops the scrolling. The version in this repo is fixed (`clearInterval(timer)`).

---

## 🚀 Advanced Version

[`scripts/tiktok_link_extractor_advanced.js`](scripts/tiktok_link_extractor_advanced.js) adds:

- ⏹️ **Smart auto-stop** when no new links appear (instead of a fixed timer).
- 📊 **CSV export** (opens in Excel) alongside the TXT file.
- 📝 Captures the **post title/caption** with each link when available.
- 🛡️ A 5-minute safety timeout to prevent infinite scrolling.

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

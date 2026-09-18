/**
 * TikTok Link Extractor — Advanced (v1.2.0)
 * =========================================
 * مزايا إضافية / Extra features:
 *   - Smart auto-stop: keeps scrolling until no new posts load (~15s idle).
 *   - 🕒 Publish-time extraction from post ID (first 32 bits = Unix timestamp).
 *   - 📝 Caption split into caption / author / sound + the raw alt text.
 *   - 📁 File names carry the account and the UTC collection time.
 *   - TXT = plain URLs (yt-dlp batch-ready, no BOM) + CSV for Excel.
 *   - 🛡️ CSV-injection guard: ' prefix for cells starting with = + - @
 *   - Profile-only filtering, post-ID dedupe, caption update-if-empty.
 *
 * Usage: same as the basic version (Console → paste → Enter).
 * Keep the tab VISIBLE while it runs — background tabs stop loading.
 *
 * Notice: public data, educational/research use only.
 */
(() => {
  const user = location.pathname.split('/')[1].toLowerCase();
  if (!user.startsWith('@')) {
    console.warn('⚠️ Open a public profile page first | افتح صفحة حساب عام أولًا');
    return;
  }

  const posts = new Map(); // postId → { url, created, caption, author, sound, alt }

  const SCROLL_STEP = 1200;
  const ROUND_INTERVAL = 1500;
  const MAX_IDLE_ROUNDS = 10;          // ~15s with no new posts → stop
  const MAX_DURATION = 5 * 60 * 1000;  // safety timeout

  let idleRounds = 0;
  let lastCount = 0;
  let finished = false;

  // file names = account + UTC collection time (no more tiktok_links(2).txt)
  const runIso = new Date().toISOString();
  const stamp = `${runIso.slice(0, 10)}_${runIso.slice(11, 16).replace(':', '')}`;
  const base = `tiktok_${user.slice(1).replace(/[^\w.-]/g, '_')}_${stamp}`;

  // First 32 bits of the post ID = Unix seconds (BigInt needed — ID is 19 digits)
  const postTime = (id) => {
    try {
      return new Date(Number(BigInt(id) >> 32n) * 1000).toISOString();
    } catch {
      return '';
    }
  };

  // CSV cell guard: escape quotes/newlines + ' prefix against CSV injection
  const csvCell = (s) => {
    s = String(s).replace(/[\r\n]+/g, ' ').replace(/"/g, '""');
    if (/^[=+\-@\t]/.test(s)) s = "'" + s;
    return `"${s}"`;
  };

  // Raw alt text of the thumbnail. Never use the card container's innerText
  // (it contains view counts like "1.2M").
  const altOf = (a) =>
    (a.querySelector('img')?.alt ||
      a.getAttribute('title') ||
      a.getAttribute('aria-label') ||
      '').trim();

  // TikTok alt format: "<caption> created by <author> with <sound>".
  // Split it so the caption column holds the caption only.
  const parseAlt = (alt) => {
    const key = 'created by ';
    const i = alt.lastIndexOf(key);
    if (i < 0) return { caption: alt, author: '', sound: '', alt };
    const caption = alt.slice(0, i).trim();
    const rest = alt.slice(i + key.length);
    const j = rest.indexOf(' with ');
    if (j < 0) return { caption, author: rest.trim(), sound: '', alt };
    return {
      caption,
      author: rest.slice(0, j).trim(),
      sound: rest.slice(j + 6).trim(),
      alt,
    };
  };

  const collect = () => {
    document
      .querySelectorAll('a[href*="/video/"], a[href*="/photo/"]')
      .forEach((a) => {
        const m = a.href.match(/\/(@[^/?#]+)\/(video|photo)\/(\d+)/);
        if (!m || m[1].toLowerCase() !== user) return;

        const alt = altOf(a);
        if (!posts.has(m[3])) {
          posts.set(m[3], {
            url: `https://www.tiktok.com/${m[1]}/${m[2]}/${m[3]}`,
            created: postTime(m[3]),
            ...parseAlt(alt),
          });
        } else if (!posts.get(m[3]).alt && alt) {
          // backfill captions that load late
          Object.assign(posts.get(m[3]), parseAlt(alt));
        }
      });
  };

  const download = (content, filename, mimeType, bom = false) => {
    // BOM only where it belongs (CSV/Excel) — it would corrupt the first URL in TXT
    const blob = new Blob([(bom ? '\uFEFF' : '') + content], { type: mimeType });
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    // revoke later — revoking immediately can cancel the download in some browsers
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  const finish = (reason) => {
    if (finished) return;
    finished = true;
    clearInterval(timer);
    clearTimeout(safetyTimeout);

    setTimeout(() => {
      collect(); // final pass — after the last batch has had 2s to load
      const entries = [...posts.values()];

      download(entries.map((e) => e.url).join('\n'), `${base}.txt`, 'text/plain');

      // stagger the 2nd file — Chrome may block/ask permission for multiple downloads
      setTimeout(() => {
        const csv = [
          'url,created,caption,author,sound,alt_raw',
          ...entries.map((e) =>
            [e.url, e.created, e.caption, e.author, e.sound, e.alt]
              .map(csvCell)
              .join(',')
          ),
        ].join('\n');
        download(csv, `${base}.csv`, 'text/csv', true);
      }, 800);

      console.log(`✅ ${reason}`);
      console.log(`📊 ${entries.length} posts → ${base}.txt + ${base}.csv`);
      console.log(`🕒 Collected at ${runIso} (UTC) — times in the CSV are UTC too.`);
    }, 2000);
  };

  const round = () => {
    collect();
    window.scrollBy(0, SCROLL_STEP);

    if (posts.size === lastCount) idleRounds++;
    else idleRounds = 0;
    lastCount = posts.size;

    console.log(`⏳ ${posts.size} posts so far...`);

    if (idleRounds >= MAX_IDLE_ROUNDS) {
      finish(
        'Stopped: no new posts for ~15s. Verify you reached the END of the profile ' +
          '(login popups pause loading; keep the tab visible).'
      );
    }
  };

  const timer = setInterval(round, ROUND_INTERVAL);
  const safetyTimeout = setTimeout(
    () => finish('Safety timeout (5 min).'),
    MAX_DURATION
  );

  console.log(`🎯 Target: ${user} — collecting, auto-stops at profile end.`);
})();

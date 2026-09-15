/**
 * TikTok Link Extractor — Advanced (v1.1.1)
 * ==========================================
 * مزايا إضافية / Extra features:
 *   - Smart auto-stop: keeps scrolling until no new posts load (~15s idle).
 *   - 🕒 Publish-time extraction from post ID (first 32 bits = Unix timestamp).
 *   - TXT = plain URLs (yt-dlp batch-ready, no BOM) + CSV = url,created,title.
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

  const posts = new Map(); // postId → { url, created, title }

  const SCROLL_STEP = 1200;
  const ROUND_INTERVAL = 1500;
  const MAX_IDLE_ROUNDS = 10;          // ~15s with no new posts → stop
  const MAX_DURATION = 5 * 60 * 1000;  // safety timeout

  let idleRounds = 0;
  let lastCount = 0;
  let finished = false;

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

  // Caption: thumbnail alt is the real caption; title/aria-label as fallback.
  // Never use the card container's innerText (it contains view counts like "1.2M").
  const captionOf = (a) =>
    (a.querySelector('img')?.alt ||
      a.getAttribute('title') ||
      a.getAttribute('aria-label') ||
      '').trim();

  const collect = () => {
    document
      .querySelectorAll('a[href*="/video/"], a[href*="/photo/"]')
      .forEach((a) => {
        const m = a.href.match(/\/(@[^/?#]+)\/(video|photo)\/(\d+)/);
        if (!m || m[1].toLowerCase() !== user) return;

        const caption = captionOf(a);
        if (!posts.has(m[3])) {
          posts.set(m[3], {
            url: `https://www.tiktok.com/${m[1]}/${m[2]}/${m[3]}`,
            created: postTime(m[3]),
            title: caption,
          });
        } else if (!posts.get(m[3]).title && caption) {
          posts.get(m[3]).title = caption; // backfill captions that load late
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

      download(
        entries.map((e) => e.url).join('\n'),
        'tiktok_links.txt',
        'text/plain'
      );

      // stagger the 2nd file — Chrome may block/ask permission for multiple downloads
      setTimeout(() => {
        const csv = [
          'url,created,title',
          ...entries.map((e) =>
            [csvCell(e.url), csvCell(e.created), csvCell(e.title)].join(',')
          ),
        ].join('\n');
        download(csv, 'tiktok_links.csv', 'text/csv', true);
      }, 800);

      console.log(`✅ ${reason}`);
      console.log(`📊 ${entries.length} posts → tiktok_links.txt + tiktok_links.csv`);
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

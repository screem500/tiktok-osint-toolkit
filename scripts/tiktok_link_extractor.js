/**
 * TikTok Link Extractor — Basic (v1.1.1)
 * ======================================
 * Usage: open a public profile → F12 → Console → paste → Enter,
 *        then wait ~32 seconds — tiktok_links.txt downloads automatically.
 *
 * Output: plain URLs, one per line — ready as a yt-dlp batch file.
 * Notice: public data, educational/research use only.
 * Arabic guide: README.ar.md
 */
(() => {
  const user = location.pathname.split('/')[1].toLowerCase();
  if (!user.startsWith('@')) {
    console.warn('Open a public profile page first.');
    return;
  }

  const posts = new Map(); // postId → url (dedupe by post ID, merge URL variants)

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
      a.download = 'tiktok_links.txt';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      console.log(`Collected ${posts.size} posts → tiktok_links.txt`);
    }, 2000);
  }, 30000);
})();

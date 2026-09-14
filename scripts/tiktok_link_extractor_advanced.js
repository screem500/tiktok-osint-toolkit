/**
 * TikTok Link Extractor — Advanced Version / النسخة المتقدمة
 * ===========================================================
 * مزايا إضافية / Extra features:
 *   - إيقاف تلقائي ذكي عند التوقف عن العثور على روابط جديدة.
 *     Smart auto-stop when no new links appear.
 *   - تصدير النتائج بصيغتين: TXT و CSV (قابل للفتح في Excel).
 *     Export as both TXT and CSV (Excel-friendly).
 *   - محاولة التقاط عنوان/وصف المنشور مع كل رابط.
 *     Attempts to capture the post title/caption with each link.
 *   - مهلة أمان قصوى (5 دقائق) لمنع التمرير اللانهائي.
 *     5-minute safety timeout to prevent infinite scrolling.
 *
 * الاستخدام / Usage: نفس خطوات النسخة الأساسية
 * Same steps as the basic version (Console → paste → Enter).
 *
 * تنبيه / Notice: للاستخدام التعليمي والبحثي على البيانات العامة فقط.
 * For educational and research use on public data only.
 */

(() => {
  const links = new Map(); // url → { url, title }
  const SCROLL_STEP = 1200;            // مقدار التمرير في كل جولة (بكسل) | pixels per round
  const ROUND_INTERVAL = 1500;         // الفترة بين الجولات (مللي ثانية) | ms between rounds
  const MAX_IDLE_ROUNDS = 10;          // إيقاف بعد 10 جولات دون روابط جديدة | stop after 10 idle rounds
  const MAX_DURATION = 5 * 60 * 1000;  // مهلة أمان: 5 دقائق | safety timeout: 5 minutes

  let idleRounds = 0;
  let lastCount = 0;
  let finished = false;

  const collect = () => {
    document
      .querySelectorAll('a[href*="/video/"], a[href*="/photo/"]')
      .forEach((a) => {
        if (a.href && !links.has(a.href)) {
          const title =
            a.getAttribute('title') ||
            a.getAttribute('aria-label') ||
            (a.closest('[data-e2e]')?.innerText || '').slice(0, 200);
          links.set(a.href, { url: a.href, title: title.trim() });
        }
      });

    window.scrollBy(0, SCROLL_STEP);

    // فحص هل توقف ظهور محتوى جديد | Check if new content stopped appearing
    if (links.size === lastCount) {
      idleRounds++;
    } else {
      idleRounds = 0;
    }
    lastCount = links.size;

    console.log(`⏳ ${links.size} links collected so far... | تم جمع ${links.size} رابطًا`);

    if (idleRounds >= MAX_IDLE_ROUNDS) finish('Collection complete | اكتمل الجمع');
  };

  const download = (content, filename, mimeType) => {
    // \uFEFF = BOM لضمان ظهور العربية بشكل صحيح في Excel
    // BOM ensures Arabic displays correctly in Excel
    const blob = new Blob(['\uFEFF' + content], { type: mimeType });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const finish = (reason) => {
    if (finished) return;
    finished = true;
    clearInterval(timer);
    clearTimeout(safetyTimeout);

    const entries = [...links.values()];

    // ملف نصي: الروابط فقط | Plain text: URLs only
    download(
      entries.map((e) => e.url).join('\n'),
      'tiktok_links.txt',
      'text/plain'
    );

    // ملف CSV: الرابط + العنوان | CSV: URL + title
    const csvRows = [
      'url,title',
      ...entries.map(
        (e) => `"${e.url}","${e.title.replace(/"/g, '""')}"`
      ),
    ];
    download(csvRows.join('\n'), 'tiktok_links.csv', 'text/csv');

    console.log(`✅ ${reason}`);
    console.log(`📊 Total: ${entries.length} links | إجمالي الروابط: ${entries.length}`);
    console.log('📄 tiktok_links.txt + tiktok_links.csv');
  };

  const timer = setInterval(collect, ROUND_INTERVAL);
  const safetyTimeout = setTimeout(
    () => finish('Safety timeout reached (5 min) | انتهت مهلة الأمان'),
    MAX_DURATION
  );

  console.log('🚀 Collecting links... auto-stops when done. | بدأ جمع الروابط... سيتوقف تلقائيًا.');
})();

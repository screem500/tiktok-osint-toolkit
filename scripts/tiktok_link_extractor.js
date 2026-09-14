/**
 * TikTok Link Extractor — Basic Version / النسخة الأساسية
 * ========================================================
 * الاستخدام:
 *   1. افتح صفحة الحساب العام على تيك توك في المتصفح.
 *   2. افتح أدوات المطور (F12) ← تبويب Console.
 *   3. الصق هذا الكود بالكامل واضغط Enter.
 *   4. انتظر 30 ثانية — سيتم تحميل ملف tiktok_links.txt تلقائيًا.
 *
 * Usage:
 *   1. Open the public TikTok profile page in your browser.
 *   2. Open Developer Tools (F12) → Console tab.
 *   3. Paste this entire code and press Enter.
 *   4. Wait 30 seconds — tiktok_links.txt will download automatically.
 *
 * ملاحظة / Note: هذه النسخة مصحّحة — يتم تخزين معرّف المؤقّت (timer)
 * حتى يعمل clearInterval بشكل صحيح.
 * This version is fixed — the timer ID is stored so clearInterval works.
 *
 * تنبيه / Notice: للاستخدام التعليمي والبحثي على البيانات العامة فقط.
 * For educational and research use on public data only.
 */

let links = [];

// مؤقّت التمرير وجمع الروابط كل 1.5 ثانية
// Scroll & collect links every 1.5 seconds
let timer = setInterval(() => {
  document
    .querySelectorAll('a[href*="/video/"], a[href*="/photo/"]')
    .forEach((a) => {
      if (a.href && !links.includes(a.href)) {
        links.push(a.href);
      }
    });
  window.scrollBy(0, 1000);
}, 1500);

// بعد 30 ثانية: إيقاف التمرير وتنزيل النتائج
// After 30 seconds: stop scrolling and download the results
setTimeout(() => {
  clearInterval(timer);

  let blob = new Blob([links.join('\n')], { type: 'text/plain' });
  let a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'tiktok_links.txt';
  a.click();

  console.log('✅ تم استخراج ' + links.length + ' رابط | Extracted ' + links.length + ' links');
  console.log('📄 tiktok_links.txt');
}, 30000);

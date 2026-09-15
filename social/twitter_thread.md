# 🐦 مواد النشر على X (تويتر) | X (Twitter) Promo Thread

مواد جاهزة للترويج للمشروع — عربي + إنجليزي.
Ready-to-post promo material — Arabic + English.

> 💡 ملاحظة: الكود أطول من حد الأحرف في التغريدة. الأفضل نشره كصورة في الرد،
> أو وضع رابط المستودع للنسخ المباشر.
> Note: the code exceeds the character limit. Post it as an image in the reply,
> or link the repository for easy copying.

---

## 🇸🇦 النسخة العربية

### التغريدة الرئيسية

```
📥 تجمع روابط منشورات حساب عام على تيك توك دون إضافات أو برامج؟

كود JavaScript بسيط داخل المتصفح: تمرير تلقائي + جمع روابط الفيديوهات والصور + حفظها في ملف نصي.

الخطوات والكود في الرد 👇
الكود الكامل: github.com/Screem500/tiktok-osint-toolkit
```

### الرد (الخطوات + صورة الكود)

```
الخطوات:

1️⃣ افتح صفحة الحساب في كروم أو فايرفوكس
2️⃣ اضغط F12 ← تبويب Console
3️⃣ الصق الكود واضغط Enter
4️⃣ انتظر ~32 ثانية — سيتم تنزيل tiktok_links.txt

📌 يجمع الكود الروابط الظاهرة في الصفحة أثناء التمرير؛ الحسابات الكبيرة تحتاج وقتًا أطول، ولا يضمن استخراج كل المنشورات.
```

### الرد الثاني (تحذير + قانونية) — سطر واحد لكل منهما

```
⚠️ لا تلصق أي كود في Console إلا من مصدر تثق به وتقرأه بنفسك — هذا الأسلوب نفسه يُستخدم في احتيال سرقة الجلسات (Self-XSS).

⚖️ الأداة للبيانات العامة والاستخدام المشروع فقط — التفاصيل في ملف الإرشادات القانونية داخل المستودع.
```

### كود الرد (يُنشر كصورة أو في منشور طويل) — نسخة v1.1.1

> الكود أدناه مطابق حرفيًا لملف `scripts/tiktok_link_extractor.js` في المستودع.
> صورة `code_tweet.png` مولّدة من هذه النسخة.

```javascript
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
```

---

## 🇬🇧 English Version

### Main Tweet

```
📥 Want to collect post links from a public TikTok account — no extensions, no installs?

A simple JavaScript snippet right in your browser: auto-scroll + collect video/photo links + save them to a text file.

Steps & code in the reply 👇
Full code: github.com/Screem500/tiktok-osint-toolkit
```

### Reply (steps + code image)

```
Steps:

1️⃣ Open the profile page in Chrome or Firefox
2️⃣ Press F12 → Console tab
3️⃣ Paste the code and hit Enter
4️⃣ Wait ~32 seconds — tiktok_links.txt will download

📌 It only collects links visible while scrolling; large accounts may need more time, and it doesn't guarantee every post.
```

### Second Reply (warning + legality)

```
⚠️ Never paste code into your Console unless it comes from a source you trust and you've read it yourself — this exact technique is abused by session-theft scams (Self-XSS).

⚖️ This tool is for public data and lawful use only — details in the legal guidelines file in the repo.
```

### Reply Code (post as an image or long post)

> نفس الكود أعلاه / Same code as above — identical to `scripts/tiktok_link_extractor.js` (v1.1.1), and `code_tweet.png` is generated from it.

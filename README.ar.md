# 🕵️ TikTok OSINT Toolkit

**[English Version 🇬🇧](README.md)**

مجموعة أدوات مفتوحة المصدر لاستخراج روابط منشورات حسابات تيك توك **العامة** مباشرةً من المتصفح، دون تثبيت أي برامج، مع أدلة تعليمية حول الاستخبارات مفتوحة المصدر (OSINT) والتحقيق الجنائي الرقمي.

> ⚠️ **تنبيه قانوني ومهم**: هذا المشروع لأغراض **تعليمية وبحثية فقط**، وللاستخدام على البيانات العامة أو بإذن صريح من صاحب الحساب. اقرأ [الدليل القانوني والأخلاقي](docs/ethics_legal.md) قبل أي استخدام.

---

## 📁 محتويات المشروع

```
tiktok-osint-toolkit/
├── README.md                          ← English version 🇬🇧
├── README.ar.md                       ← أنت هنا (العربية)
├── LICENSE                            ← رخصة MIT
├── CONTRIBUTING.md                    ← دليل المساهمة (عربي)
├── CONTRIBUTING.en.md                 ← Contribution guide (English)
├── scripts/
│   ├── tiktok_link_extractor.js       ← السكربت الأساسي (المصدر الموحد للكود)
│   └── tiktok_link_extractor_advanced.js  ← نسخة متقدمة (CSV بأعمدة الوصف والصوت + توقيت النشر)
├── docs/
│   ├── osint.md / osint.en.md                     ← دليل OSINT (عربي / إنجليزي)
│   ├── digital_forensics.md / .en.md              ← التحقيق الجنائي (عربي / إنجليزي)
│   └── ethics_legal.md / ethics_legal.en.md       ← الإرشادات القانونية (عربي / إنجليزي)
└── social/
    ├── twitter_thread.md              ← نصوص جاهزة للنشر على X (عربي / إنجليزي)
    └── code_tweet.png                 ← صورة الكود للمنشورات
```

> ⚠️ **قبل لصق أي كود في Console**: لصق الأكواد هو نفس أسلوب احتيال **Self-XSS** الذي تُسرق به الجلسات. قد يطلب منك المتصفح كتابة `allow pasting` أول مرة. لا تشغّل إلا كودًا مأخوذًا **من هذا المستودع الرسمي**، واقرأه قبل التشغيل.

---

## 🎯 الطريقة المضمونة (أقل من دقيقتين)

1. افتح متصفح **كروم** أو **فايرفوكس** على جهازك.
2. اذهب إلى حساب تيك توك الذي تريد (مثال: `https://www.tiktok.com/@اسم_الحساب`).
3. اضغط `F12` (أو `Ctrl+Shift+I`) لفتح أدوات المطور.
4. اذهب إلى تبويب **Console** (وحدة التحكم).
5. انسخ محتوى ملف [`scripts/tiktok_link_extractor.js`](scripts/tiktok_link_extractor.js) بالكامل.
6. الصقه في وحدة التحكم واضغط `Enter`.
7. انتظر ~32 ثانية (سيقوم بالتمرير التلقائي وجمع الروابط).
8. سيُحمَّل ملف نصي تلقائيًا، باسم يحمل اسم الحساب ووقت الجمع بتوقيت UTC، مثل `tiktok_username_2026-09-18_1305.txt`.

> 📌 **ملاحظة التغطية**: السكربت يجمع فقط المنشورات التي تُحمَّل فعليًا أثناء التمرير (نحو 20 تمريرة في 30 ثانية)، فقد لا تُغطى الحسابات الكبيرة كاملة — استخدم [النسخة المتقدمة](#-النسخة-المتقدمة) التي تستمر حتى نهاية الحساب.

### الكود (نسخة سريعة)

الكتلة أدناه **مطابقة حرفيًا** لملف [`scripts/tiktok_link_extractor.js`](scripts/tiktok_link_extractor.js) — مصدر واحد للحقيقة:

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

📄 **المخرجات**: روابط صافية، رابط في كل سطر — الملف يعمل مباشرة كقائمة batch مع `yt-dlp`. واسم الملف يحمل اسم الحساب ووقت الجمع بتوقيت UTC، فلا تتكرر الملفات ولا تختلط عليك الحسابات. استخراج توقيت النشر موجود في CSV النسخة المتقدمة.

### ✅ لماذا هذه الطريقة ناجحة؟

- تعمل مباشرة من متصفحك، وتتصفح بوتيرة هادئة كالمستخدم العادي.
- لا تحتاج إلى تثبيت أي شيء.
- **لا تتجاوز أي حماية** — فهي تقرأ فقط الروابط الظاهرة أصلًا في الصفحة خلال جلستك.

> 🛠️ **ملاحظات تقنية** (v1.2.0): الروابط تُفلتر على حساب الصفحة فقط (فلا تختلط بها منشورات تبويب إعادة النشر)، ويُمنع التكرار على رقم المنشور، وتُنفَّذ جولة جمع أخيرة بعد توقف التمرير — النسخ السابقة كانت تُفوّت آخر المنشورات المحمّلة. وتُسمَّى الملفات الناتجة بصيغة `tiktok_<الحساب>_<تاريخ UTC>_<الساعة>`.

---

## 🚀 النسخة المتقدمة

ملف [`scripts/tiktok_link_extractor_advanced.js`](scripts/tiktok_link_extractor_advanced.js) يقدّم:

- ⏹️ **إيقاف تلقائي ذكي**: تستمر بالتمرير حتى نهاية الحساب (مثالية للحسابات الكبيرة). **أبقِ التبويب ظاهرًا أمامك** أثناء العمل — التبويبات الخلفية توقف التحميل وقد تسبب إيقافًا مبكرًا.
- 📥 **ينزّل ملفين** (TXT ثم CSV بفارق ثانية): قد يطلب كروم **السماح بتنزيل ملفات متعددة** — وافق وإلا لن يصلك ملف CSV.
- 🕒 **استخراج وقت نشر** كل منشور من معرّفه (أول 32 بت = طابع Unix).
- 📊 **تصدير CSV** — الأعمدة: `url, created, caption, author, sound, alt_raw` (يُفتح في Excel) بالإضافة إلى ملف TXT بروابط صافية.
- 📁 **أسماء ملفات واضحة**: `tiktok_<الحساب>_<تاريخ UTC>_<الساعة>.txt` و `.csv` — وداعًا لـ `tiktok_links(2).txt`.
- 🛡️ **تحصين CSV Injection**: أي خلية تبدأ بـ `= + - @` تُسبق بعلامة `'`، مع تهريب التنصيص والأسطر — فالوصف نص يكتبه صاحب الحساب ولا يُؤمَن.
- 📝 التقاط **عنوان/وصف المنشور** مع كل رابط عند توفّره.
- ⏱️ مهلة أمان قصوى (5 دقائق) لمنع التمرير اللانهائي.

### 📄 مثال على المخرجات

تيك توك يضع وصف المنشور داخل نص `alt` للصورة المصغّرة، بالصيغة
`<الوصف> created by <صاحب الحساب> with <الصوت>`. والنسخة المتقدمة تفصل ذلك إلى
أعمدة مستقلة، وتحتفظ بالنص الأصلي كما هو في عمود `alt_raw`:

```csv
url,created,caption,author,sound,alt_raw
"https://www.tiktok.com/@example/video/7474502610695851270","2025-02-23T06:47:33.000Z","شروق الشمس في الصحراء #سفر","Example User","Example User's original sound","شروق الشمس في الصحراء #سفر created by Example User with Example User's original sound"
"https://www.tiktok.com/@example/video/7443881082975440146","2024-12-02T18:20:23.000Z","","Example User","Example User's original sound","created by Example User with Example User's original sound"
```

الوصف الفارغ يعني أن المنشور بلا وصف. وجميع التواريخ بتوقيت **UTC**، ويُحفظ
`alt_raw` دون تعديل حتى يمكن التحقق من صحة الفصل بالرجوع إلى النص الأصلي.

أما ملف TXT المرافق فيبقى روابط صافية، رابط في كل سطر:

```text
https://www.tiktok.com/@example/video/7474502610695851270
https://www.tiktok.com/@example/video/7443881082975440146
```

---

## 📚 الأدلة التعليمية

| الدليل | الوصف |
|---|---|
| [🔎 دليل OSINT](docs/osint.md) ([English](docs/osint.en.md)) | ما هي الاستخبارات مفتوحة المصدر، دورة جمع المعلومات، وأشهر الأدوات المجانية |
| [🔬 التحقيق الجنائي الرقمي](docs/digital_forensics.md) ([English](docs/digital_forensics.en.md)) | المبادئ الأساسية، سلسلة حفظ الأدلة، وأدوات التحليل الجنائي |
| [⚖️ الإرشادات القانونية](docs/ethics_legal.md) ([English](docs/ethics_legal.en.md)) | حدود الاستخدام المشروع، الخصوصية، وشروط الخدمة |

---

## 🤝 المساهمة

المساهمات مرحّب بها! اقرأ [CONTRIBUTING.md](CONTRIBUTING.md) ([English](CONTRIBUTING.en.md)) لمعرفة كيفية اقتراح تحسينات أو إضافة أدوات جديدة.

## 📄 الرخصة

هذا المشروع مرخّص تحت [رخصة MIT](LICENSE).

## ⭐ دعم المشروع

إذا أفادك المشروع، امنحه نجمة ⭐ على GitHub وشاركه مع المهتمين بالأمن السيبراني والبحث مفتوح المصدر.

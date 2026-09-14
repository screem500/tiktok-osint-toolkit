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
│   ├── tiktok_link_extractor.js       ← السكربت الأساسي (تعليقات ثنائية اللغة)
│   └── tiktok_link_extractor_advanced.js  ← نسخة متقدمة (CSV + بيانات وصفية)
└── docs/
    ├── osint.md / osint.en.md                     ← دليل OSINT (عربي / إنجليزي)
    ├── digital_forensics.md / .en.md              ← التحقيق الجنائي (عربي / إنجليزي)
    └── ethics_legal.md / ethics_legal.en.md       ← الإرشادات القانونية (عربي / إنجليزي)
```

---

## 🎯 الطريقة المضمونة (أقل من دقيقتين)

1. افتح متصفح **كروم** أو **فايرفوكس** على جهازك.
2. اذهب إلى حساب تيك توك الذي تريد (مثال: `https://www.tiktok.com/@اسم_الحساب`).
3. اضغط `F12` (أو `Ctrl+Shift+I`) لفتح أدوات المطور.
4. اذهب إلى تبويب **Console** (وحدة التحكم).
5. انسخ محتوى ملف [`scripts/tiktok_link_extractor.js`](scripts/tiktok_link_extractor.js) بالكامل.
6. الصقه في وحدة التحكم واضغط `Enter`.
7. انتظر 30 ثانية (سيقوم بالتمرير التلقائي وجمع الروابط).
8. سيتم تحميل ملف نصي باسم `tiktok_links.txt` يحتوي على جميع روابط المنشورات (فيديوهات وصور).

### الكود (نسخة سريعة)

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
  console.log('تم استخراج '+links.length+' رابط');
},30000);
```

### ✅ لماذا هذه الطريقة ناجحة؟

- تعمل مباشرة من متصفحك كما لو كنت أنت المستخدم الحقيقي.
- لا تحتاج إلى تثبيت أي شيء.
- تعمل داخل جلسة المتصفح نفسها، فلا تتعامل مع أنظمة الحماية الخارجية.

> 🛠️ **ملاحظة تقنية**: الكود المتداول في الشروحات يحتوي خطأً صغيرًا — `clearInterval()` بدون معرف المؤقّت لا يوقف التمرير فعليًا. النسخة أعلاه في هذا المشروع مصحّحة (`clearInterval(timer)`).

---

## 🚀 النسخة المتقدمة

ملف [`scripts/tiktok_link_extractor_advanced.js`](scripts/tiktok_link_extractor_advanced.js) يقدّم:

- ⏹️ **إيقاف تلقائي ذكي** عند التوقف عن العثور على روابط جديدة (بدلاً من وقت ثابت).
- 📊 **تصدير CSV** (يمكن فتحه في Excel) بالإضافة إلى ملف TXT.
- 📝 التقاط **عنوان/وصف المنشور** مع كل رابط عند توفّره.
- 🛡️ مهلة أمان قصوى (5 دقائق) لمنع التمرير اللانهائي.

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

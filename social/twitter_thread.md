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
الكود الكامل: [رابط المستودع]
```

### الرد (الخطوات + صورة الكود)

```
الخطوات:

1️⃣ افتح صفحة الحساب في كروم أو فايرفوكس
2️⃣ اضغط F12 ← تبويب Console
3️⃣ الصق الكود واضغط Enter
4️⃣ انتظر 30 ثانية — سيتم تنزيل tiktok_links.txt

📌 يجمع الكود الروابط الظاهرة في الصفحة أثناء التمرير؛ الحسابات الكبيرة تحتاج وقتًا أطول، ولا يضمن استخراج كل المنشورات.
```

### كود الرد (يُنشر كصورة أو في منشور طويل)

```javascript
(() => {
  const links = new Set();

  const collect = () => {
    document.querySelectorAll(
      'a[href*="/video/"], a[href*="/photo/"]'
    ).forEach(a => links.add(a.href));
  };

  collect();

  const timer = setInterval(() => {
    collect();
    window.scrollBy(0, 1000);
  }, 1500);

  setTimeout(() => {
    clearInterval(timer);
    collect();

    const blob = new Blob(
      [[...links].join('\n')],
      { type: 'text/plain;charset=utf-8' }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tiktok_links.txt';
    a.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
    console.log(`تم جمع ${links.size} رابط`);
  }, 30000);
})();
```

> ✅ ملاحظة: هذه النسخة مُصحّحة — يجب تمرير معرّف المؤقّت إلى
> `clearInterval(timer)` حتى يتوقف التمرير فعليًا.

---

## 🇬🇧 English Version

### Main Tweet

```
📥 Want to collect post links from a public TikTok account — no extensions, no installs?

A simple JavaScript snippet right in your browser: auto-scroll + collect video/photo links + save them to a text file.

Steps & code in the reply 👇
Full code: [repo link]
```

### Reply (steps + code image)

```
Steps:

1️⃣ Open the profile page in Chrome or Firefox
2️⃣ Press F12 → Console tab
3️⃣ Paste the code and hit Enter
4️⃣ Wait 30 seconds — tiktok_links.txt will download

📌 It only collects links visible while scrolling; large accounts may need more time, and it doesn't guarantee every post.
```

### Reply Code (post as an image or long post)

> نفس الكود أعلاه / Same code as above.

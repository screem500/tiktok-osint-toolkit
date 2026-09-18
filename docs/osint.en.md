# 🔎 Open Source Intelligence (OSINT) Guide

**[النسخة العربية](osint.md)**

> **OSINT = Open Source Intelligence**: collecting and analyzing information from **publicly available** sources (websites, social networks, public records, web archives) for legitimate research, journalistic, or security purposes.

---

## 🧭 The Intelligence Cycle

1. **Planning & Direction**: define your research question precisely (what do you want to know, and why?).
2. **Collection**: gather data from available public sources.
3. **Processing**: organize and classify the data (spreadsheets, timelines, link lists).
4. **Analysis**: extract patterns, relationships, and conclusions.
5. **Dissemination**: present findings clearly, with documented sources.
6. **Feedback**: did you answer the question? Do you need another round?

---

## 🧰 Toolbox by Category

### 👤 Username & Account Research
| Tool | Purpose |
|---|---|
| **Sherlock** | Search for a username across hundreds of platforms |
| **WhatsMyName** | Open-source username correlation project |
| **Namechk** | Check username availability/usage |

### 📧 Email Addresses
| Tool | Purpose |
|---|---|
| **Holehe** | Find platforms where an email is registered (without sending messages) |
| **Have I Been Pwned** | Check whether an email appeared in known breaches |

### 🌐 Domains & Websites
| Tool | Purpose |
|---|---|
| **theHarvester** | Harvest emails and subdomains |
| **crt.sh** | TLS certificates — subdomain discovery |
| **Shodan** | Search engine for internet-connected devices and servers |
| **Wayback Machine** | Historical archive of web pages |

### 🖼️ Images & Media
| Tool | Purpose |
|---|---|
| **Google Lens / TinEye** | Reverse image search |
| **ExifTool** | Read image metadata (EXIF) |
| **InVID / WeVerify** | Video analysis and frame extraction |

### 🗺️ Geolocation
| Tool | Purpose |
|---|---|
| **Google Earth / Maps** | Match landmarks and locations |
| **SunCalc** | Sun position and shadow analysis to determine time/place of capture |

### 📱 Social Media
- **This project's scripts**: extract post links from public TikTok accounts.
- Manual archiving: timestamped screenshots with URLs (important as evidence).

---

## 🕒 Extracting Publish Time from a Post ID (TikTok)

Every TikTok post URL ends with a 19-digit number:

```
https://www.tiktok.com/@username/video/7474502610695851270
                                       ^^^^^^^^^^^^^^^^^^^ post ID
```

That number is not random. TikTok generates it in the **Snowflake** style, which stores the creation time inside the ID itself: the first **32 bits** (of its 64-bit form) are the number of seconds since 1 Jan 1970 (Unix time); the remaining bits are internal server and sequence data.

The result: **every link carries its own timestamp** — no API, no need to open the post.

### The method

Shift the ID right by 32 bits and you get the timestamp in seconds:

```
7474502610695851270 >> 32 = 1740293253  →  2025-02-23 06:47:33 UTC
6945422069853179138 >> 32 = 1617107090  →  2021-03-30 12:24:50 UTC
```

Shifting by 32 bits is the same as dividing by 2³² = 4294967296 and dropping the remainder.

**JavaScript** (this is what the toolkit uses):

```js
new Date(Number(BigInt(id) >> 32n) * 1000).toISOString();
```

**Python**:

```python
from datetime import datetime, timezone
datetime.fromtimestamp(int(post_id) >> 32, timezone.utc).isoformat()
```

**Bash**:

```bash
date -u -d @$(( 7474502610695851270 >> 32 ))
```

### Two common pitfalls

**1. Don't use plain numbers in JavaScript.** A post ID has 19 digits, while the largest safe integer in JavaScript is `9007199254740991` (16 digits), so `Number` silently corrupts the last digits:

```js
Number("7474502610695851270") // 7474502610695851000 ← precision lost
```

Read the ID with `BigInt`, then convert the small result (the timestamp) back to `Number`.

**2. If you convert to binary by hand, pad to 64 bits first.** The ID above is only 63 bits long, so taking the first 32 characters of an unpadded string yields `3480586507` — a wrong date — while the padded 64-bit form yields the correct `1740293253`. Using `>> 32` avoids the mistake entirely.

### Verifying the result

Open the post and compare the displayed date. Note that TikTok shows dates in **your local time**, while the value above is **UTC**, so the day can differ around midnight (Saudi Arabia is UTC+3).

### Why it matters in an investigation

- Build a full timeline for an account from a list of links alone.
- Infer the likely time zone from recurring posting hours.
- Spot accounts whose whole catalogue was uploaded within minutes.
- Test a timing claim: was the post before or after the event?
- Compare two accounts suspected of being run by the same person.

### Limits

- The time is when the ID was generated on TikTok's servers — not when the video was filmed — and it can differ by seconds from the moment the post went live.
- It does not tell you **who** posted, or whether the caption or content was edited later.
- Renaming the account does not change the ID — useful — but it does not prove account ownership either.
- A timestamp alone is not evidence: record it together with the URL, a screenshot and the collection time, as described in [digital forensics fundamentals](digital_forensics.en.md).

---

## 🧩 Frameworks & References

- **OSINT Framework** (osintframework.com): a tree of tools categorized by research type.
- **Bellingcat Toolkit**: operational guides from a well-known investigative team.
- **IntelTechniques**: ready-made tools and search lists.

---

## 🛡️ Researcher Safety (OPSEC)

- Use a **separate browser profile** (or a virtual machine) for research activities.
- Never interact with the subject (no likes, follows, or messages) — observe only.
- Document everything: URL + date + screenshot, because content may be deleted.
- Never create sock-puppet accounts impersonating real people — illegal in most jurisdictions.

> 🚨 **TikTok-specific warning — Profile View History**:
> TikTok has a *Profile View History* feature. If it is enabled **on both your account and the subject's**, they can see that you visited their profile. Worse: a visit made while the feature was on **stays recorded even if you disable it afterwards**.
> So, **before** opening the subject's profile (not after):
> - Browse **logged out** when possible, or use a **dedicated research account** that doesn't identify you.
> - Check the setting: `Profile ← ☰ ← Settings and privacy ← Privacy ← Profile views`.

---

## ⚖️ Reminder

Collect only what is **publicly accessible without bypassing barriers** (no hacking, no password circumvention, no deceptive social engineering). See the [legal guidelines](ethics_legal.en.md).

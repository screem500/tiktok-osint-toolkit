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

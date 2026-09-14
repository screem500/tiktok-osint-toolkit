# 🔬 Digital Forensics Fundamentals

**[النسخة العربية](digital_forensics.md)**

> Digital forensics is the process of **collecting, preserving, analyzing, and presenting** digital evidence in a documented, scientific manner that maintains its integrity and admissibility.

---

## 🧱 Core Principles

1. **Never alter original evidence**: always work on a **forensic image** (disk copy), never on the original device.
2. **Complete documentation**: log every step — who performed it, when, and with which tool.
3. **Hash verification**: compute the `SHA-256` hash of both original and copy to prove they match.
4. **Repeatability**: another examiner must be able to reproduce your steps and reach the same results.

---

## ⛓️ Chain of Custody

A formal record tracking evidence from seizure to presentation:

| Field | Example |
|---|---|
| Evidence description | Mobile phone, model X, serial number Y |
| Who seized it | Name, date, location |
| Transfer log | Signatures for every handover |
| Storage location | Evidence locker, seal number |
| Digital fingerprint | `SHA-256: abc123...` |

Any break in this chain can **invalidate the evidence** in court.

---

## 🧰 Tools by Specialization

### 💾 Disk & File Analysis
| Tool | Purpose |
|---|---|
| **Autopsy** | Free, comprehensive disk-analysis platform (GUI) |
| **FTK Imager** | Create forensic disk images and preview files |
| **Guymager / dd** | Disk imaging on Linux |

### 🧠 Memory (RAM) Analysis
| Tool | Purpose |
|---|---|
| **Volatility 3** | The leading framework for memory-dump analysis: processes, connections, malware |

### 🌐 Network Analysis
| Tool | Purpose |
|---|---|
| **Wireshark** | Capture and analyze network packets |
| **NetworkMiner** | Extract files and images from PCAP files |

### 🖼️ Files & Metadata
| Tool | Purpose |
|---|---|
| **ExifTool** | Metadata of images and documents |
| **binwalk** | Firmware analysis and embedded-file extraction |

### 📱 Mobile Devices
- Well-known commercial tools: Cellebrite, Oxygen Forensics (for authorized agencies).
- Open-source alternatives for educational use: ALEAPP (Android), iLEAPP (iOS) — they analyze lawfully obtained backups.

---

## 🔄 Typical Workflow (Simplified)

```
1. Seizure & securing   → isolate device, use a Write Blocker
2. Forensic imaging     → bit-by-bit disk image + SHA-256 hashing
3. Analysis             → on the copy only: deleted files, logs, events
4. Timeline building    → order events chronologically
5. Reporting            → clear findings + methodology + verification hashes
```

---

## 📜 Reference Standards

- **ISO/IEC 27037**: guidelines for identification, collection, and acquisition of digital evidence.
- **ISO/IEC 27042**: guidelines for analysis and interpretation of digital evidence.
- **NIST SP 800-86**: guide to integrating forensic techniques into incident response.

---

## ⚖️ Relationship with OSINT

- **OSINT** = collection from public sources (outside the subject's devices).
- **Digital forensics** = analysis of digital evidence **lawfully in your possession** (devices seized under warrant, or your own devices).
- In a real investigation they complement each other: OSINT draws the external picture, forensic evidence confirms it internally.

> ⚠️ Analyzing devices you do not own, without legal authorization, may constitute a crime. See the [legal guidelines](ethics_legal.en.md).

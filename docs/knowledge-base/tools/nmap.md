---
title: 🔎 Nmap
---

# Nmap

> **Important / Legal & Ethics:** Use Nmap **only** for systems you have explicit permission to scan (your own infrastructure, test/lab networks, or written authorization). Unauthorized network scans can be illegal and cause operational damage. This guide explains concepts, useful commands for **legitimate** testing, and security considerations — not a guide for misuse.

---

## Table of Contents

1. Overview
2. Installation
3. Basic Commands
4. Port Scanning Options
5. Service & Version Detection
6. OS Detection
7. Nmap Scripting Engine (NSE)
8. Timing, Performance & Load Control
9. Output Formats & Logging
10. Scan Examples (authorized, e.g. localhost / Lab)
11. Interpreting Results
12. Integration & Automation
13. Best Practices (Operational Security & Compliance)
14. Useful Resources

---

## 1. Overview

- **Nmap (Network Mapper)** is an open-source tool for network discovery and security auditing: host detection, port scanning, service and version detection, OS fingerprinting, NSE scripts for advanced analysis.
- Typical use cases: inventory management, vulnerability preparation in authorized tests, network diagnostics.

---

## 2. Installation

### Linux (Debian/Ubuntu)

```bash
sudo apt update
sudo apt install nmap -y
```

### macOS (Homebrew)

```bash
brew install nmap
```

### Windows

- Download and run installer from [https://nmap.org](https://nmap.org) (includes optional Zenmap GUI).

---

## 3. Basic Commands

```bash
# Help / Version
nmap -h
nmap --version

# Simple scan (top ports)

nmap target.example.com

# Multiple targets / CIDR / file

nmap 192.168.1.10 192.168.1.20
nmap 192.168.1.0/24
nmap -iL targets.txt   # targets.txt: one target per line
```

---

## 4. Port Scanning Options

```bash
# TCP Connect (default, no root required)
nmap -sT target

# TCP SYN (fast, requires root/privileges)
sudo nmap -sS target

# UDP Scan (slow)
sudo nmap -sU target

# Specific ports or ranges
nmap -p 22,80,443 target
nmap -p 1-1024 target

# All ports (1–65535)
nmap -p- target
```

---

## 5. Service & Version Detection

```bash
# Version detection (banner)
sudo nmap -sV target

# Aggressive detection (sV, O, scripts)
sudo nmap -A target
```

---

## 6. OS Detection

```bash
# OS Fingerprinting (usually requires root)
sudo nmap -O target

# Combination: SYN + Version + OS
sudo nmap -sS -sV -O target
```

---

## 7. Nmap Scripting Engine (NSE)

- NSE allows execution of predefined scripts (discovery, vuln, auth, safe, intrusive).

```bash
# Default scripts
nmap --script=default target

# Single or multiple scripts
nmap --script=http-enum,http-title target

# Script category (caution: vuln can be intrusive)
nmap --script "safe" target
nmap --script "vuln" target
```

> Note: NSE scripts can perform intrusive actions. Use only with authorization; test in lab first.

---

## 8. Timing, Performance & Load Control

```bash
# Timing Templates (T0–T5)
nmap -T0 target   # very slow, stealthy
nmap -T3 target   # default
nmap -T4 target   # faster (local network)
nmap -T5 target   # very aggressive

# Additional control
nmap --min-rate 50 --max-retries 2 --host-timeout 30m target
```

Tips:

- In production environments choose lower T-level (T0–T3).
- Always test aggressive options in an isolated environment first.

---

## 9. Output Formats & Logging

```bash
# Normal
nmap -oN output.txt target

# XML (machine readable)
nmap -oX output.xml target

# Grepable (legacy)
nmap -oG output.gnmap target

# All formats with prefix
nmap -oA output_prefix target  # creates output_prefix.nmap / .xml / .gnmap
```

XML is useful for automated post-processing or import into tools.

---

## 10. Scan Examples (authorized targets / Lab only)

### 10.1 Basic Port Scan (localhost)

```bash
nmap -v localhost
```

### 10.2 Top-1000 Ports with Service Detection

```bash
sudo nmap -sV --version-all target.local
```

### 10.3 Full Port Range with Versions (slow)

```bash
sudo nmap -p- -sV target.local
```

### 10.4 OS + Service + Scripts (aggressive — lab only)

```bash
sudo nmap -A --script=default,safe target.lab
```

### 10.5 UDP Check (targeted, very slow)

```bash
sudo nmap -sU -p 53,67,123 target.lab
```

### 10.6 Target File + XML Output

```bash
nmap -iL targets.txt -oX results.xml
```

---

## 11. Interpreting Results (Brief)

- **open** → Service responds; port is reachable.
- **closed** → Port is reachable, but no service.
- **filtered** → Packet was filtered (e.g. firewall) — no conclusion about service possible.
- **unfiltered** → Port responds, but nmap cannot determine state definitively.
- **open|filtered** / **closed|filtered** → uncertain states depending on protocol response.

Combine port status with `-sV` and NSE outputs for more informed conclusions.

---

## 12. Integration & Automation

- Use `-oX` for XML → parse with Python (ElementTree), xsltproc, or nmap-parser libs.
- CI/CD: Scans only for authorized test environments.
- Automated workflows: Nmap → Parser → Ticketing/Reporting (prioritization of findings).

---

## 13. Best Practices (Security, Processes & Compliance)

1. **Obtain authorization** (in writing) — scope, time window, targets, contact persons.
2. **Not in production without coordination:** avoid load and disruptions.
3. **Set rate-limit & timing:** lower T-value / min-rate for production systems.
4. **Logging & audit:** maintain scan logs, authorization documents, result reports.
5. **Lab tests first:** test scripts / aggressive options in isolated environments.
6. **Only necessary NSE scripts:** avoid unnecessarily intrusive categories.
7. **Inform SOC:** scans can trigger IDS/IPS alarms; coordination reduces false positives.
8. **Regular scans:** inventory & regression testing after changes.
9. **Updates:** keep Nmap & NSE scripts up to date.
10. **Data protection:** scans can reveal personal data — handle in compliance with legal requirements.

---

## 14. Useful Resources

- Official website & docs: [https://nmap.org](https://nmap.org)
- NSE Script catalog: [https://nmap.org/nsedoc/](https://nmap.org/nsedoc/)
- Book: *Nmap Network Scanning* (Gordon Lyon / Fyodor)
- Community / mailing lists: nmap-discuss, GitHub repos

---

## Brief Workflow Proposal (authorized)

1. Ensure scope & authorization.
2. Light discovery scan (ping/host discovery) with `-sn`.
3. Targeted port scan (`-sS -p <range>`), `-T3`.
4. Service detection `-sV` on found open ports.
5. In lab: `-O` and selected NSE scripts (safe).
6. Export (XML) → automated analysis → report.
7. Coordination with stakeholders & remediation plan.

---

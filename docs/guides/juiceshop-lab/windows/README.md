---
title: Windows
---

# Secure Local Setup (Windows Host + Kali VM + Docker)

This guide describes a **secure local setup** for OWASP Juice Shop when using

- a **Windows host** (with Docker Desktop and VirtualBox),
- a **Kali Linux VM** running inside VirtualBox, and
- a **Docker container** running Juice Shop on the Windows host.

Goal:  

✅ Kali can access the Internet and reach Juice Shop (via browser or Burp Suite).  
❌ Juice Shop container is **not reachable from outside** the host machine.

---

## 1. VirtualBox VM Network Configuration

| Adapter       | Mode                               | Purpose                                             |
|---------------|------------------------------------|-----------------------------------------------------|
| **Adapter 1** | **NAT**                            | Internet access for Kali (updates, downloads, etc.) |
| **Adapter 2** | **Host-Only Adapter** (`vboxnet0`) | Private network between Windows ↔ Kali              |

### Example IPs

| Device           | Interface          | Example IP       | Purpose              |
|------------------|--------------------|------------------|----------------------|
| **Windows Host** | `vboxnet0`         | `192.168.56.1`   | Host-Only endpoint   |
| **Kali VM**      | `eth0` (NAT)       | `10.0.2.15`      | Internet access      |
| **Kali VM**      | `eth1` (Host-Only) | `192.168.56.101` | Access to Juice Shop |

### Verify on Kali

```bash
ip a
ping 192.168.56.1
```

✅ If you get replies, the Host-Only network is active.

---

## 2. Run OWASP Juice Shop in Docker (on Windows Host)

Pull and run the official image.  
Bind it **only to the Host-Only adapter IP** (`192.168.56.1`) so that it’s reachable only from the Kali VM.

### Commands (PowerShell or CMD)

```powershell
docker pull bkimminich/juice-shop:latest

docker run -d --name juice-shop `
  -p 192.168.56.1:3000:3000 `
  --restart unless-stopped `
  bkimminich/juice-shop:latest
```

### Result

- Juice Shop is available at `http://192.168.56.1:3000` (from Kali or Host).
- It is **not accessible from other LAN devices or the Internet**.

### Test from Kali

```bash
curl http://192.168.56.1:3000
# or open http://192.168.56.1:3000 in a browser or BurpSuite
```

✅ Should return the HTML of the Juice Shop.

---

## 3. Optional: Windows Firewall Rules for Extra Security

To ensure that Juice Shop is **only accessible from the Kali VM**, block incoming traffic to port `3000` on all public and private interfaces except the VirtualBox Host-Only adapter.

### Step 1 – Open PowerShell as Administrator

### Step 2 – Create New Firewall Rule

```powershell
New-NetFirewallRule -DisplayName "Juice Shop Block External" `
  -Direction Inbound -Protocol TCP -LocalPort 3000 `
  -Action Block -Profile Domain,Private,Public
```

### Step 3 – Allow Access Only from Host-Only Interface

If your Host-Only network uses `192.168.56.0/24`, allow that range:

```powershell
New-NetFirewallRule -DisplayName "Juice Shop Allow Host-Only" `
  -Direction Inbound -Protocol TCP -LocalPort 3000 `
  -Action Allow -RemoteAddress 192.168.56.0/24
```

Verify:

```powershell
Get-NetFirewallRule | findstr "Juice"
```

---

## 4. Test and Verify

| Test                    | Command                              | Expected Result |
|-------------------------|--------------------------------------|-----------------|
| From another LAN device | `curl http://<Windows-LAN-IP>:3000`  | Blocked         |
| From Kali VM            | `curl http://192.168.56.1:3000`      | Works           |
| From Host               | Browser → `http://192.168.56.1:3000` | Works           |

---

## 5. Summary

| Component                       | Configuration                          | Purpose                   |
|---------------------------------|----------------------------------------|---------------------------|
| **VirtualBox (Kali VM)**        | Adapter 1 = NAT, Adapter 2 = Host-Only | Internet + local access   |
| **Docker Container (Windows)**  | `-p 192.168.56.1:3000:3000`            | Bind only to Host-Only IP |
| **Windows Firewall**            | Block all except Host-Only subnet      | Additional protection     |
| **Kali Tools (Burp, Browser)**  | Access via `http://192.168.56.1:3000`  | Juice Shop reachable      |
| **Outside network**             | No access                              | Secure                    |

---

## 6. Security Tips

- Do **not** use `-p 0.0.0.0:3000:3000` — that exposes Juice Shop to the entire LAN.
- Keep the Docker network bridged internally to Windows only.
- Use the Windows Firewall rule to restrict access further.
- Regularly update Docker Desktop and Juice Shop to the latest versions.

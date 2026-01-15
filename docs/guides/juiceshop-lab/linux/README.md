---
title: Linux
---

# Secure Local Setup

## (Linux Host + Kali VM + Docker)

This guide describes a **secure local setup** for OWASP Juice Shop when using

- a **Linux host** (Ubuntu/Debian/Fedora, Docker installed),
- a **Kali Linux VM** running inside VirtualBox, and
- a **Docker container** running Juice Shop on the Linux host.

Goal:  

✅ Kali can access the Internet and reach Juice Shop (via browser or Burp Suite).  
❌ Juice Shop container is **not reachable from outside** the host machine.

---

## 1. VirtualBox VM Network Configuration

| Adapter       | Mode                               | Purpose                                             |
|---------------|------------------------------------|-----------------------------------------------------|
| **Adapter 1** | **NAT**                            | Internet access for Kali (updates, downloads, etc.) |
| **Adapter 2** | **Host-Only Adapter** (`vboxnet0`) | Private network between Linux Host ↔ Kali           |

### Example IPs

| Device         | Interface          | Example IP       | Purpose                    |
|----------------|--------------------|------------------|----------------------------|
| **Linux Host** | `vboxnet0`         | `192.168.56.1`   | Host-Only network endpoint |
| **Kali VM**    | `eth0` (NAT)       | `10.0.2.15`      | Internet access            |
| **Kali VM**    | `eth1` (Host-Only) | `192.168.56.101` | Access to Juice Shop       |

### Verify on Kali

```bash
ip a
ping 192.168.56.1
```

✅ If you get replies, the Host-Only network is active.

---

## 2. Run OWASP Juice Shop in Docker (on Linux Host)

Pull and run the official image.  
Bind it **only to the Host-Only adapter IP** (`192.168.56.1`) so that it’s reachable only from the Kali VM.

```bash
docker pull bkimminich/juice-shop:latest

docker run -d --name juice-shop   -p 192.168.56.1:3000:3000   --restart unless-stopped   bkimminich/juice-shop:latest
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

## 3. Firewall Setup on Linux Host

To ensure Juice Shop is **only accessible from the Kali VM**, block incoming traffic to port `3000` on all interfaces except the Host-Only adapter.

### Option A – Using UFW (Ubuntu/Debian)

```bash
sudo ufw default deny incoming
sudo ufw allow in on vboxnet0 to any port 3000 proto tcp
sudo ufw enable
```

### Option B – Using iptables

```bash
sudo iptables -A INPUT -i vboxnet0 -p tcp --dport 3000 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 3000 -j DROP
sudo iptables-save | sudo tee /etc/iptables/rules.v4
```

✅ Only connections via the Host-Only interface (`vboxnet0`) are allowed.

---

## 4. Test and Verify

| Test                | Command                              | Expected Result  |
|---------------------|--------------------------------------|------------------|
| Kali → Host-Only IP | `curl http://192.168.56.1:3000`      | Works            |
| Host itself         | Browser → `http://192.168.56.1:3000` | Works            |
| Other LAN machines  | `curl http://<Linux-LAN-IP>:3000`    | Blocked          |

---

## 5. Summary

| Component                         | Configuration                          | Purpose                   |
|-----------------------------------|----------------------------------------|---------------------------|
| **VirtualBox (Kali VM)**          | Adapter 1 = NAT, Adapter 2 = Host-Only | Internet + local access   |
| **Docker Container (Linux Host)** | `-p 192.168.56.1:3000:3000`            | Bind only to Host-Only IP |
| **Firewall (UFW/iptables)**       | Block all except Host-Only subnet      | Extra protection          |
| **Kali Tools (Burp, Browser)**    | Access via `http://192.168.56.1:3000`  | Juice Shop reachable      |
| **Outside network**               | No access                              | Secure                    |

---

## 6. Security Tips

- Do **not** use `-p 0.0.0.0:3000:3000` — this exposes Juice Shop to the entire LAN.
- Keep Docker and VirtualBox interfaces separated.
- Use firewall rules to restrict access further.
- Regularly update Docker and Juice Shop to the latest versions.

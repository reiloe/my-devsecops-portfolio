---
title: Mac
---

# Secure Local Setup (Mac Host + Kali VM + Docker)

This guide describes a **safe local setup** for OWASP Juice Shop when using

- a **Mac host** (Apple Silicon or Intel)
- a **Kali Linux VM** running in **VirtualBox**, and
- a **Docker container** running Juice Shop on the Mac host.

Goal:  
✅ Kali can access the Internet and reach Juice Shop (e.g., for testing via browser or Burp Suite).  
❌ The Juice Shop container is **not reachable from outside** the host.

---

## 1. VirtualBox VM Network Configuration

| Adapter       | Mode                               | Purpose                                             |
|---------------|------------------------------------|-----------------------------------------------------|
| **Adapter 1** | **NAT**                            | Internet access for Kali (updates, downloads, etc.) |
| **Adapter 2** | **Host-Only Adapter** (`vboxnet0`) | Private network between Mac ↔ Kali                  |

### Example IPs

| Device       | Interface          | Example IP       | Purpose                                    |
|--------------|--------------------|------------------|--------------------------------------------|
| **Mac Host** | `vboxnet0`         | `192.168.56.1`   | Host-Only network endpoint                 |
| **Kali VM**  | `eth0` (NAT)       | `10.0.2.15`      | Internet access                            |
| **Kali VM**  | `eth1` (Host-Only) | `192.168.56.101` | Access to host services (e.g., Juice Shop) |

### Verify on Kali

```bash
ip a
ping 192.168.56.1
```

✅ If you receive replies, the Host-Only connection is working.

---

## 2. Run OWASP Juice Shop in Docker

Pull and run the official image, binding it **only to the Host-Only IP** (`192.168.56.1`):

```bash
docker pull bkimminich/juice-shop:latest

docker run -d --name juice-shop   -p 192.168.56.1:3000:3000   --restart unless-stopped   bkimminich/juice-shop:latest
```

### Result

- Juice Shop is reachable at `http://192.168.56.1:3000` (from Kali or Host).
- It is **not** reachable from other machines in the LAN or Internet.

### Test from Kali

```bash
curl http://192.168.56.1:3000
# or open http://192.168.56.1:3000 in the browser or BurpSuite
```

✅ Should return the Juice Shop HTML content.

---

## 3. Optional: macOS PF Firewall for Extra Security

Although binding to the Host-Only IP is already safe, you can add a **PF (Packet Filter)** rule to ensure  
port **3000** is only allowed on the Host-Only interface (`vboxnet0`).

### Step 1 – Create Rule File

```bash
sudo nano /etc/pf.anchors/juice-shop
```

Paste:

```pf
# Allow Juice Shop access only on Host-Only interface (vboxnet0)
# Block on external interfaces

vbox_if = "vboxnet0"
external_if = "en0"      # main Wi-Fi or Ethernet
docker_if = "bridge100"  # Docker bridge interface on macOS

# Deny access on all external networks
block in quick on $external_if proto tcp to port 3000
block in quick on $docker_if proto tcp to port 3000

# Allow Host-Only access
pass in quick on $vbox_if proto tcp to port 3000 keep state
```

### Step 2 – Load and Activate

Add this line to the end of `/etc/pf.conf`:

```pf
anchor "juice-shop"
load anchor "juice-shop" from "/etc/pf.anchors/juice-shop"
```

Reload and enable PF:

```bash
sudo pfctl -f /etc/pf.conf
sudo pfctl -e
sudo pfctl -sr
```

---

## 4. Test and Verify

| Test                    | Command                             | Expected Result                             |
|-------------------------|-------------------------------------|---------------------------------------------|
| From another LAN device | `curl http://<Mac-LAN-IP>:3000`     | Blocked                                     |
| From Kali VM            | `curl http://192.168.56.1:3000`     | Works                                       |
| View active rules       | `sudo pfctl -vvsr &#124; grep 3000` | Shows `pass on vboxnet0` and `block on en0` |

---

## 5. Summary

| Component                | Configuration                             | Purpose                   |
|--------------------------|-------------------------------------------|---------------------------|
| **VirtualBox (Kali VM)** | Adapter 1 = NAT, Adapter 2 = Host-Only    | Internet + local access   |
| **Docker Container**     | `-p 192.168.56.1:3000:3000`               | Bind only to Host-Only IP |
| **macOS PF Firewall**    | Blocks port 3000 on all except `vboxnet0` | Additional protection     |
| **Kali Browser / Burp**  | Access via `http://192.168.56.1:3000`     | Juice Shop reachable      |
| **Outside world**        | No access                                 | Secure                    |

---

## 6. Notes and Tips

- Do **not** use `-p 0.0.0.0:3000:3000` or `--network=host`.
- Keep Docker and VirtualBox interfaces separated.
- Use the PF rule as an extra safeguard if you ever change network settings.
- If needed, you can isolate further with macOS *Application Firewall* or `ufw` inside the VM.

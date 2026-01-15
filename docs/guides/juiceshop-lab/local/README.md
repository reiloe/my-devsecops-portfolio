---
title: Local
---

# OWASP Juice Shop directly on a Kali Linux VM

## Prerequisites

- Kali VM with network access and sudo.
- Git, curl, build tools installed.

## Steps

Open a terminal and install basic tools:

```bash
sudo apt update
sudo apt install -y git curl build-essential
```

Install Node.js (recommended: Node 22.x; use nvm to install/manage easily):

```bash
# install nvm (if not already)
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# install node 22 (example)
nvm install 22
nvm use 22
```

Clone Juice Shop and install dependencies:

```bash
git clone https://github.com/juice-shop/juice-shop.git
cd juice-shop
# install production deps (or npm install for full dev deps)
npm ci
```

Start the app (development):

```bash
npm start
```

Open your browser in the VM (or on the host if port is forwarded) at `<http://localhost:3000>`.

## Notes & troubleshooting

- If npm start fails because of a Node version mismatch, try a different node version via nvm.
- npm ci is preferred for reproducible CI installations; npm install also works.

## Autostart on VM boot (systemd service)

Create a systemd unit to automatically start Juice Shop when the VM boots.

Create service file (adjust User and paths to your setup; example uses user youruser and repo at /home/youruser/juice-shop):

```bash
sudo tee /etc/systemd/system/juice-shop.service > /dev/null <<'EOF'
[Unit]
Description=OWASP Juice Shop
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/home/youruser/juice-shop
# Use the full path to npm; if using nvm, point to a wrapper or use an ExecStart script
ExecStart=/usr/bin/npm start
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF
```

Reload systemd, enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable juice-shop.service
sudo systemctl start juice-shop.service
sudo journalctl -u juice-shop -f   # to follow logs
```

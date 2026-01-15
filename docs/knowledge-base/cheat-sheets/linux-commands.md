---
title: 🐧 Linux Shell Commands
sidebar_label: Linux Shell
sidebar_position: 5
tags: [linux, shell, bash, unix, system-administration, cheat-sheet]
---

# 🐧 Linux Shell Commands Cheat Sheet

Comprehensive reference for the most commonly used Linux commands for system administration across different distributions.

---

## Table of Contents

1. [System Information](#system-information)
2. [Package Management](#package-management)
3. [File & Directory Operations](#file--directory-operations)
4. [File Permissions](#file-permissions)
5. [Process Management](#process-management)
6. [System Services](#system-services)
7. [Network Management](#network-management)
8. [Disk & Filesystem](#disk--filesystem)
9. [User & Group Management](#user--group-management)
10. [System Monitoring](#system-monitoring)
11. [Log Management](#log-management)
12. [Archive & Compression](#archive--compression)
13. [Text Processing](#text-processing)
14. [SSH & Remote Access](#ssh--remote-access)
15. [Firewall Management](#firewall-management)

---

## System Information

### Basic System Info

```bash
# Display system information
uname -a                    # Complete system information
hostnamectl                 # Hostname and OS info (systemd)
lsb_release -a              # Distribution info (Debian/Ubuntu)
cat /etc/os-release         # OS information (all distros)

# Kernel version
uname -r                    # Kernel release
uname -v                    # Kernel version

# Hostname
hostname                       # Show hostname
hostname -I                    # Show IP addresses
hostnamectl set-hostname NAME  # Set hostname (systemd)

# Hardware information
lscpu                      # CPU information
lsmem                      # Memory information
lsblk                      # Block devices
lspci                      # PCI devices
lsusb                      # USB devices
dmidecode                  # DMI/SMBIOS info (requires root)

# System uptime
uptime                     # System uptime and load
uptime -p                  # Pretty uptime format
w                          # Who is logged in and what they're doing

# Date and time
date                                    # Current date and time
timedatectl                             # Date/time settings (systemd)
timedatectl set-timezone Europe/Berlin  # Set timezone
```

### Architecture & Platform

```bash
# Architecture
arch                       # Machine architecture
uname -m                   # Machine hardware name

# 32-bit or 64-bit
getconf LONG_BIT          # Returns 32 or 64
file /bin/ls              # Check binary architecture
```

---

## Package Management

### Debian/Ubuntu (APT)

```bash
# Update package lists
sudo apt update

# Upgrade installed packages
sudo apt upgrade                    # Upgrade all packages
sudo apt full-upgrade               # Upgrade + handle dependencies
sudo apt dist-upgrade               # Distribution upgrade

# Install packages
sudo apt install PACKAGE
sudo apt install -y PACKAGE        # Auto-confirm
sudo apt install package1 package2 # Multiple packages

# Remove packages
sudo apt remove PACKAGE            # Remove but keep config
sudo apt purge PACKAGE             # Remove including config
sudo apt autoremove                # Remove unused dependencies

# Search packages
apt search KEYWORD
apt-cache search KEYWORD

# Show package information
apt show PACKAGE
apt-cache show PACKAGE

# List packages
apt list --installed               # All installed
apt list --upgradable              # Upgradable packages
dpkg -l                            # List all packages

# Clean package cache
sudo apt clean                     # Remove all cached packages
sudo apt autoclean                 # Remove old cached packages

# Fix broken packages
sudo apt --fix-broken install
sudo dpkg --configure -a

# Hold/unhold package
sudo apt-mark hold PACKAGE
sudo apt-mark unhold PACKAGE
```

### RHEL/CentOS/Fedora (YUM/DNF)

```bash
# Update package lists (YUM)
sudo yum check-update

# Update packages (YUM)
sudo yum update                    # Update all
sudo yum update PACKAGE            # Update specific package

# DNF (newer, replaces YUM)
sudo dnf check-update
sudo dnf update
sudo dnf upgrade                   # Same as update

# Install packages
sudo yum install PACKAGE
sudo dnf install PACKAGE
sudo yum install -y PACKAGE        # Auto-confirm
sudo dnf install -y PACKAGE

# Remove packages
sudo yum remove PACKAGE
sudo dnf remove PACKAGE
sudo yum autoremove               # Remove unused dependencies
sudo dnf autoremove

# Search packages
yum search KEYWORD
dnf search KEYWORD

# Show package information
yum info PACKAGE
dnf info PACKAGE

# List packages
yum list installed
dnf list installed
rpm -qa                           # List all packages

# Clean cache
sudo yum clean all
sudo dnf clean all

# Enable/disable repository
sudo yum-config-manager --enable REPO
sudo yum-config-manager --disable REPO
sudo dnf config-manager --enable REPO

# List repositories
yum repolist
dnf repolist
```

### Arch Linux (Pacman)

```bash
# Update package database and upgrade
sudo pacman -Syu                   # Sync, refresh, update

# Install packages
sudo pacman -S PACKAGE             # Install package
sudo pacman -S package1 package2   # Multiple packages

# Remove packages
sudo pacman -R PACKAGE             # Remove package
sudo pacman -Rs PACKAGE            # Remove + dependencies
sudo pacman -Rns PACKAGE           # Remove + deps + configs

# Search packages
pacman -Ss KEYWORD                 # Search remote
pacman -Qs KEYWORD                 # Search local

# Show package information
pacman -Si PACKAGE                 # Remote package info
pacman -Qi PACKAGE                 # Installed package info

# List packages
pacman -Q                          # List installed
pacman -Qe                         # List explicitly installed
pacman -Qdt                        # List orphaned packages

# Clean cache
sudo pacman -Sc                    # Clean old packages
sudo pacman -Scc                   # Clean all cache
```

### openSUSE (Zypper)

```bash
# Update packages
sudo zypper refresh                # Refresh repositories
sudo zypper update                 # Update packages
sudo zypper dup                    # Distribution upgrade

# Install packages
sudo zypper install PACKAGE
sudo zypper in PACKAGE

# Remove packages
sudo zypper remove PACKAGE
sudo zypper rm PACKAGE

# Search packages
zypper search KEYWORD
zypper se KEYWORD

# Show package information
zypper info PACKAGE

# List packages
zypper packages
zypper pa

# Clean cache
sudo zypper clean
```

---

## File & Directory Operations

### Navigation

```bash
# Change directory
cd /path/to/directory
cd ~                       # Home directory
cd -                       # Previous directory
cd ..                      # Parent directory
cd ../..                   # Two levels up

# Print working directory
pwd

# List files
ls                         # Basic list
ls -l                      # Long format
ls -la                     # Long format + hidden files
ls -lh                     # Human-readable sizes
ls -lt                     # Sort by modification time
ls -ltr                    # Sort by time (reverse)
ls -lS                     # Sort by size
ls -R                      # Recursive listing
```

### File Operations

```bash
# Create files
touch file.txt             # Create empty file or update timestamp
touch file1 file2 file3    # Multiple files

# Copy files
cp source dest             # Copy file
cp -r source dest          # Copy directory recursively
cp -a source dest          # Copy preserving attributes
cp -i source dest          # Interactive (prompt before overwrite)
cp -v source dest          # Verbose output
cp -u source dest          # Update (copy only if newer)

# Move/Rename files
mv source dest             # Move or rename
mv -i source dest          # Interactive
mv -v source dest          # Verbose

# Remove files
rm file                    # Remove file
rm -f file                 # Force remove
rm -i file                 # Interactive
rm -r directory            # Remove directory recursively
rm -rf directory           # Force remove directory (DANGEROUS!)

# Create symbolic link
ln -s target linkname      # Create symbolic link
ln target linkname         # Create hard link

# Find files
find /path -name "*.txt"   # Find by name
find /path -type f         # Find files
find /path -type d         # Find directories
find /path -mtime -7       # Modified in last 7 days
find /path -size +100M     # Files larger than 100MB
find /path -user username  # Files owned by user

# Locate files (faster, uses database)
locate filename
sudo updatedb              # Update locate database
```

### Directory Operations

```bash
# Create directories
mkdir directory            # Create directory
mkdir -p path/to/dir       # Create parent directories
mkdir -m 755 directory     # Create with specific permissions

# Remove directories
rmdir directory            # Remove empty directory
rm -r directory            # Remove directory and contents
rm -rf directory           # Force remove (DANGEROUS!)

# Tree view
tree                       # Show directory tree
tree -L 2                  # Limit depth to 2 levels
tree -d                    # Directories only
```

### File Content

```bash
# View file content
cat file                   # Display entire file
cat -n file                # Display with line numbers
less file                  # View file (paginated)
more file                  # View file (basic pager)
head file                  # First 10 lines
head -n 20 file            # First 20 lines
tail file                  # Last 10 lines
tail -n 20 file            # Last 20 lines
tail -f file               # Follow file (watch for changes)

# Edit files
nano file                  # Nano editor (beginner-friendly)
vim file                   # Vim editor
vi file                    # Vi editor

# File comparison
diff file1 file2           # Compare files
diff -u file1 file2        # Unified format
diff -r dir1 dir2          # Compare directories
vimdiff file1 file2        # Visual diff in vim
```

---

## File Permissions

### Understanding Permissions

```text
-rwxr-xr-x
│││││││││└─ Execute (others)
││││││││└── Write (others)
│││││││└─── Read (others)
││││││└──── Execute (group)
│││││└───── Write (group)
││││└────── Read (group)
│││└─────── Execute (owner)
││└──────── Write (owner)
│└───────── Read (owner)
└────────── File type (- = file, d = directory)
```

### Permission Commands

```bash
# Change permissions (symbolic)
chmod u+x file             # Add execute for owner
chmod g+w file             # Add write for group
chmod o-r file             # Remove read for others
chmod a+x file             # Add execute for all
chmod u+rwx,g+rx,o+r file  # Multiple changes

# Change permissions (numeric)
chmod 755 file             # rwxr-xr-x
chmod 644 file             # rw-r--r--
chmod 600 file             # rw-------
chmod 777 file             # rwxrwxrwx (AVOID!)
chmod -R 755 directory     # Recursive

# Change owner
chown user file            # Change owner
chown user:group file      # Change owner and group
chown -R user directory    # Recursive

# Change group
chgrp group file           # Change group
chgrp -R group directory   # Recursive

# View permissions
ls -l                      # Long listing
stat file                  # Detailed file information
getfacl file               # Get ACL permissions

# Set default permissions
umask                      # Show current umask
umask 022                  # Set umask (directories 755, files 644)

# Special permissions
chmod +t directory         # Sticky bit (only owner can delete)
chmod u+s file             # SUID (run as owner)
chmod g+s directory        # SGID (inherit group)
```

---

## Process Management

### View Processes

```bash
# List processes
ps                         # Current shell processes
ps aux                     # All processes (BSD style)
ps -ef                     # All processes (UNIX style)
ps aux | grep PROCESS      # Find specific process
pstree                     # Process tree

# Top/htop
top                        # Interactive process viewer
htop                       # Better interactive viewer (install first)
atop                       # Advanced system monitor

# Process details
pidof PROCESS              # Get PID of process
pgrep PROCESS              # Find processes by name
ps -p PID                  # Process info by PID
lsof -p PID                # Files opened by process
```

### Kill Processes

```bash
# Kill by PID
kill PID                   # Terminate process
kill -9 PID                # Force kill (SIGKILL)
kill -15 PID               # Graceful termination (SIGTERM)
kill -HUP PID              # Reload configuration (SIGHUP)

# Kill by name
killall PROCESS            # Kill all processes by name
killall -9 PROCESS         # Force kill all
pkill PROCESS              # Kill processes by pattern
pkill -u username          # Kill all processes by user

# List all signals
kill -l                    # List available signals
```

### Background & Foreground

```bash
# Background processes
command &                  # Run in background
Ctrl+Z                     # Suspend current process
bg                         # Continue suspended process in background
jobs                       # List background jobs
fg                         # Bring background job to foreground
fg %1                      # Bring specific job to foreground

# Disown process
disown                     # Remove job from shell
nohup command &            # Run immune to hangups
```

### Process Priority

```bash
# Nice (priority)
nice -n 10 command         # Start with lower priority
renice -n -5 -p PID        # Change priority of running process

# Priority values: -20 (highest) to 19 (lowest)
# Default: 0
```

---

## System Services

### systemd (Modern Systems)

```bash
# Service management
sudo systemctl start SERVICE       # Start service
sudo systemctl stop SERVICE        # Stop service
sudo systemctl restart SERVICE     # Restart service
sudo systemctl reload SERVICE      # Reload configuration
sudo systemctl status SERVICE      # Show service status

# Enable/disable services
sudo systemctl enable SERVICE      # Enable at boot
sudo systemctl disable SERVICE     # Disable at boot
sudo systemctl is-enabled SERVICE  # Check if enabled

# List services
systemctl list-units --type=service        # Running services
systemctl list-units --type=service --all  # All services
systemctl list-unit-files                  # All unit files

# System state
sudo systemctl reboot              # Reboot system
sudo systemctl poweroff            # Power off
sudo systemctl suspend             # Suspend system
sudo systemctl hibernate           # Hibernate

# Journal logs
journalctl                         # All logs
journalctl -u SERVICE              # Logs for specific service
journalctl -f                      # Follow logs
journalctl -b                      # Logs since last boot
journalctl --since "1 hour ago"    # Recent logs
journalctl -p err                  # Error logs only

# Analyze boot time
systemd-analyze                    # Overall boot time
systemd-analyze blame              # Per-service boot time
systemd-analyze critical-chain     # Critical path
```

### SysVinit (Older Systems)

```bash
# Service management
sudo service SERVICE start         # Start service
sudo service SERVICE stop          # Stop service
sudo service SERVICE restart       # Restart service
sudo service SERVICE status        # Service status

# Or using init.d directly
sudo /etc/init.d/SERVICE start
sudo /etc/init.d/SERVICE stop

# Enable/disable (Debian/Ubuntu)
sudo update-rc.d SERVICE defaults  # Enable
sudo update-rc.d SERVICE remove    # Disable

# Enable/disable (RHEL/CentOS)
sudo chkconfig SERVICE on          # Enable
sudo chkconfig SERVICE off         # Disable
sudo chkconfig --list              # List services
```

---

## Network Management

### Network Interfaces

```bash
# Modern tools (ip command)
ip addr                            # Show IP addresses
ip addr show                       # Show all interfaces
ip addr show eth0                  # Show specific interface
ip link                            # Show link status
ip link set eth0 up                # Bring interface up
ip link set eth0 down              # Bring interface down

# Legacy tools (deprecated but still common)
ifconfig                           # Show interfaces
ifconfig eth0                      # Show specific interface
ifconfig eth0 up                   # Bring interface up
ifconfig eth0 down                 # Bring interface down

# Interface configuration
sudo ip addr add 192.168.1.10/24 dev eth0   # Add IP address
sudo ip addr del 192.168.1.10/24 dev eth0   # Remove IP address
```

### Routing

```bash
# View routing table
ip route                           # Show routing table
ip route show                      # Same as above
route -n                           # Legacy command

# Add/remove routes
sudo ip route add 192.168.2.0/24 via 192.168.1.1     # Add route
sudo ip route del 192.168.2.0/24                     # Delete route
sudo ip route add default via 192.168.1.1            # Add default gateway
```

### DNS

```bash
# DNS lookup
nslookup domain.com                # Query DNS
dig domain.com                     # Detailed DNS query
dig +short domain.com              # Short output
host domain.com                    # Simple DNS lookup

# DNS configuration
cat /etc/resolv.conf               # DNS servers
```

### Network Testing

```bash
# Ping
ping HOST                          # Ping host
ping -c 4 HOST                     # Ping 4 times
ping6 HOST                         # IPv6 ping

# Traceroute
traceroute HOST                    # Trace route to host
tracepath HOST                     # Alternative traceroute
mtr HOST                           # Combined ping/traceroute

# Port scanning
netstat -tulnp                     # Show listening ports (legacy)
ss -tulnp                          # Show listening ports (modern)
lsof -i :PORT                      # Show process using port
nmap HOST                          # Port scan (install first)

# Download/Upload testing
wget URL                           # Download file
curl URL                           # Download and display
curl -O URL                        # Download and save
curl -I URL                        # Show headers only

# Network speed test
speedtest-cli                      # Internet speed test (install first)

# Network connections
netstat -an                        # All connections
netstat -tunlp                     # Listening ports with PID
ss -s                              # Socket statistics
ss -tulpn                          # Listening sockets
```

### Network Configuration Files

```bash
# Debian/Ubuntu (netplan - modern)
/etc/netplan/*.yaml

# Debian/Ubuntu (legacy)
/etc/network/interfaces

# RHEL/CentOS/Fedora
/etc/sysconfig/network-scripts/ifcfg-*

# Apply network changes
sudo netplan apply                 # Apply netplan config (Ubuntu 18.04+)
sudo systemctl restart networking  # Debian/Ubuntu
sudo systemctl restart network     # RHEL/CentOS
```

### Hostname

```bash
# View hostname
hostname                           # Show hostname
hostname -f                        # Show FQDN

# Set hostname (temporary)
sudo hostname NEW_HOSTNAME

# Set hostname (permanent - systemd)
sudo hostnamectl set-hostname NEW_HOSTNAME

# Hosts file
/etc/hosts                         # Local hostname resolution
```

---

## Disk & Filesystem

### Disk Usage

```bash
# Disk space
df                                 # Disk space usage
df -h                              # Human-readable
df -T                              # Show filesystem type
df -i                              # Inode usage

# Directory size
du -sh /path                       # Total size
du -h /path                        # All subdirectories
du -sh */ | sort -rh               # Sorted directory sizes
du -h --max-depth=1 /path          # One level deep

# Find large files
find /path -type f -size +100M     # Files > 100MB
find /path -type f -size +1G       # Files > 1GB
du -ah /path | sort -rh | head -20 # Top 20 largest

# Disk usage by type
du -sh /var/log/*                  # Log files
du -sh /var/cache/*                # Cache files
```

### Disk Partitions

```bash
# List disks and partitions
lsblk                              # Block devices tree
lsblk -f                           # With filesystem info
fdisk -l                           # List all disks (requires root)
parted -l                          # Alternative

# Create partitions
sudo fdisk /dev/sdX                # Partition disk (MBR)
sudo parted /dev/sdX               # Partition disk (GPT)
sudo cfdisk /dev/sdX               # Interactive partitioning

# Format partitions
sudo mkfs.ext4 /dev/sdX1           # Format as ext4
sudo mkfs.xfs /dev/sdX1            # Format as XFS
sudo mkfs.vfat /dev/sdX1           # Format as FAT32
```

### Mount/Unmount

```bash
# Mount
sudo mount /dev/sdX1 /mnt          # Mount partition
sudo mount -t ext4 /dev/sdX1 /mnt  # Specify filesystem type
sudo mount -o ro /dev/sdX1 /mnt    # Read-only mount

# Unmount
sudo umount /mnt                   # Unmount
sudo umount -l /mnt                # Lazy unmount
sudo umount -f /mnt                # Force unmount

# Show mounted filesystems
mount                              # All mounted
mount | grep /dev/sd               # Only disk mounts
findmnt                            # Tree view

# Persistent mounts
/etc/fstab                         # Filesystem table
sudo mount -a                      # Mount all from fstab
```

### Filesystem Check

```bash
# Check filesystem
sudo fsck /dev/sdX1                # Check filesystem
sudo fsck -y /dev/sdX1             # Auto-fix errors
sudo e2fsck /dev/sdX1              # ext2/3/4 check
sudo xfs_repair /dev/sdX1          # XFS repair

# SMART monitoring
sudo smartctl -a /dev/sdX          # SMART status
sudo smartctl -t short /dev/sdX    # Run short test
```

### LVM (Logical Volume Manager)

```bash
# Physical volumes
sudo pvdisplay                     # Show PVs
sudo pvcreate /dev/sdX             # Create PV

# Volume groups
sudo vgdisplay                     # Show VGs
sudo vgcreate VG_NAME /dev/sdX     # Create VG
sudo vgextend VG_NAME /dev/sdY     # Extend VG

# Logical volumes
sudo lvdisplay                           # Show LVs
sudo lvcreate -L 10G -n LV_NAME VG_NAME  # Create LV
sudo lvextend -L +5G /dev/VG/LV          # Extend LV
sudo lvresize -r -L +5G /dev/VG/LV       # Extend + resize filesystem
```

### RAID

```bash
# Check RAID status
cat /proc/mdstat                   # Software RAID status
sudo mdadm --detail /dev/mdX       # RAID array details

# Create RAID array
sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdX /dev/sdY

# Monitor RAID
sudo mdadm --monitor --daemonise /dev/md0
```

---

## User & Group Management

### User Management

```bash
# Add user
sudo useradd USERNAME              # Create user
sudo useradd -m USERNAME           # Create user with home directory
sudo useradd -m -s /bin/bash USERNAME  # Specify shell
sudo adduser USERNAME              # Interactive user creation (Debian)

# Set password
sudo passwd USERNAME               # Set user password
passwd                             # Change own password

# Modify user
sudo usermod -aG GROUP USERNAME    # Add user to group
sudo usermod -l NEWNAME OLDNAME    # Rename user
sudo usermod -s /bin/zsh USERNAME  # Change shell
sudo usermod -L USERNAME           # Lock user account
sudo usermod -U USERNAME           # Unlock user account

# Delete user
sudo userdel USERNAME              # Delete user (keep home)
sudo userdel -r USERNAME           # Delete user and home directory

# User information
id                                 # Current user info
id USERNAME                        # User info
whoami                             # Current username
who                                # Logged in users
w                                  # Detailed logged in users
last                               # Login history
lastlog                            # Last login per user
finger USERNAME                    # User information
```

### Group Management

```bash
# Create group
sudo groupadd GROUPNAME

# Delete group
sudo groupdel GROUPNAME

# Modify group
sudo groupmod -n NEWNAME OLDNAME   # Rename group

# Add user to group
sudo usermod -aG GROUP USERNAME    # Add to supplementary group
sudo gpasswd -a USERNAME GROUP     # Alternative method

# Remove user from group
sudo gpasswd -d USERNAME GROUP

# List groups
groups                             # Current user's groups
groups USERNAME                    # User's groups
cat /etc/group                     # All groups
getent group                       # All groups (includes NIS/LDAP)
```

### Sudo Configuration

```bash
# Edit sudoers file
sudo visudo                        # Edit sudoers safely

# Grant sudo access
sudo usermod -aG sudo USERNAME     # Debian/Ubuntu
sudo usermod -aG wheel USERNAME    # RHEL/CentOS/Fedora

# Sudoers file location
/etc/sudoers

# Sudoers examples
USERNAME ALL=(ALL) ALL             # Full sudo access
USERNAME ALL=(ALL) NOPASSWD: ALL   # No password required
%admin ALL=(ALL) ALL               # Group access
```

---

## System Monitoring

### CPU & Memory

```bash
# CPU usage
top                                # Interactive CPU monitor
htop                               # Better alternative
mpstat                             # CPU statistics
lscpu                              # CPU information
cat /proc/cpuinfo                  # Detailed CPU info

# Memory usage
free                               # Memory usage
free -h                            # Human-readable
free -m                            # In megabytes
vmstat                             # Virtual memory statistics
vmstat 5                           # Update every 5 seconds

# System load
uptime                             # Load averages
cat /proc/loadavg                  # Load average file
```

### I/O Monitoring

```bash
# Disk I/O
iostat                             # I/O statistics
iostat -x 5                        # Extended stats, 5 sec intervals
iotop                              # I/O by process (requires root)

# Network I/O
iftop                              # Network bandwidth by connection
nethogs                            # Network usage by process
nload                              # Network bandwidth monitor
vnstat                             # Network traffic statistics
```

### System Resources

```bash
# All-in-one monitoring
glances                            # Comprehensive system monitor
dstat                              # Versatile resource statistics
nmon                               # Performance monitoring

# Resource limits
ulimit -a                          # Show all limits
ulimit -n                          # Max open files
ulimit -n 4096                     # Set max open files
```

---

## Log Management

### System Logs

```bash
# Log files location
/var/log/                          # Main log directory
/var/log/syslog                    # System log (Debian/Ubuntu)
/var/log/messages                  # System log (RHEL/CentOS)
/var/log/auth.log                  # Authentication log (Debian/Ubuntu)
/var/log/secure                    # Authentication log (RHEL/CentOS)
/var/log/kern.log                  # Kernel log
/var/log/dmesg                     # Boot messages

# View logs
tail -f /var/log/syslog            # Follow log
tail -n 100 /var/log/syslog        # Last 100 lines
less /var/log/syslog               # View with pager
cat /var/log/syslog | grep ERROR   # Filter errors

# Journal (systemd)
journalctl                         # All journal logs
journalctl -f                      # Follow logs
journalctl -u SERVICE              # Service logs
journalctl -b                      # Since last boot
journalctl -b -1                   # Previous boot
journalctl --since "2 hours ago"   # Recent logs
journalctl --since "2024-12-01"    # From date
journalctl -p err                  # Errors only
journalctl -p warning              # Warnings and above
journalctl --disk-usage            # Disk usage
journalctl --vacuum-time=2weeks    # Clean old logs
journalctl --vacuum-size=500M      # Limit log size

# Kernel messages
dmesg                              # Kernel ring buffer
dmesg | tail                       # Recent kernel messages
dmesg -w                           # Follow kernel messages
dmesg -T                           # Human-readable timestamps
```

### Log Rotation

```bash
# Logrotate configuration
/etc/logrotate.conf                # Main config
/etc/logrotate.d/                  # Service-specific configs

# Manual rotation
sudo logrotate /etc/logrotate.conf     # Run logrotate
sudo logrotate -f /etc/logrotate.conf  # Force rotation
```

---

## Archive & Compression

### tar Archives

```bash
# Create archive
tar -cvf archive.tar /path         # Create tar archive
tar -czvf archive.tar.gz /path     # Create gzip compressed
tar -cjvf archive.tar.bz2 /path    # Create bzip2 compressed
tar -cJvf archive.tar.xz /path     # Create xz compressed

# Extract archive
tar -xvf archive.tar               # Extract tar
tar -xzvf archive.tar.gz           # Extract gzip
tar -xjvf archive.tar.bz2          # Extract bzip2
tar -xJvf archive.tar.xz           # Extract xz
tar -xvf archive.tar -C /dest      # Extract to specific directory

# List archive contents
tar -tvf archive.tar               # List contents
tar -tzvf archive.tar.gz           # List gzip archive

# Append to archive
tar -rvf archive.tar newfile       # Add file to archive

# Extract specific file
tar -xvf archive.tar file.txt      # Extract single file

# Flags:
# -c: create
# -x: extract
# -t: list
# -v: verbose
# -f: file
# -z: gzip
# -j: bzip2
# -J: xz
# -r: append
# -C: change directory
```

### Compression

```bash
# gzip
gzip file                          # Compress file (removes original)
gzip -k file                       # Keep original
gunzip file.gz                     # Decompress
gzip -d file.gz                    # Decompress
gzip -9 file                       # Maximum compression

# bzip2
bzip2 file                         # Compress file
bunzip2 file.bz2                   # Decompress
bzip2 -d file.bz2                  # Decompress
bzip2 -9 file                      # Maximum compression

# xz
xz file                            # Compress file
unxz file.xz                       # Decompress
xz -d file.xz                      # Decompress
xz -9 file                         # Maximum compression

# zip/unzip
zip archive.zip file1 file2        # Create zip
zip -r archive.zip directory       # Zip directory
unzip archive.zip                  # Extract zip
unzip -l archive.zip               # List zip contents
unzip archive.zip -d /dest         # Extract to directory
```

---

## Text Processing

### grep (Search)

```bash
# Basic search
grep "pattern" file                # Search in file
grep -i "pattern" file             # Case-insensitive
grep -v "pattern" file             # Invert match
grep -n "pattern" file             # Show line numbers
grep -c "pattern" file             # Count matches
grep -l "pattern" *                # List matching files
grep -r "pattern" /path            # Recursive search
grep -w "word" file                # Match whole word
grep -A 3 "pattern" file           # Show 3 lines after
grep -B 3 "pattern" file           # Show 3 lines before
grep -C 3 "pattern" file           # Show 3 lines context

# Extended regex
grep -E "pattern1|pattern2" file   # OR pattern
egrep "pattern1|pattern2" file     # Same as above

# Multiple patterns
grep -e "pat1" -e "pat2" file      # Multiple patterns
grep -f patterns.txt file          # Patterns from file

# Exclude files/directories
grep -r "pattern" --exclude="*.log" /path
grep -r "pattern" --exclude-dir="node_modules" /path
```

### sed (Stream Editor)

```bash
# Basic substitution
sed 's/old/new/' file              # Replace first occurrence per line
sed 's/old/new/g' file             # Replace all occurrences
sed 's/old/new/gi' file            # Case-insensitive replace
sed -i 's/old/new/g' file          # Edit file in-place
sed -i.bak 's/old/new/g' file      # Edit with backup

# Line operations
sed -n '5p' file                   # Print line 5
sed -n '1,10p' file                # Print lines 1-10
sed '5d' file                      # Delete line 5
sed '/pattern/d' file              # Delete matching lines
sed -n '/pattern/p' file           # Print matching lines

# Multiple commands
sed -e 's/foo/bar/' -e 's/baz/qux/' file
sed '1,10s/old/new/g' file         # Replace in lines 1-10
```

### awk (Text Processing)

```bash
# Basic usage
awk '{print $1}' file              # Print first column
awk '{print $1, $3}' file          # Print columns 1 and 3
awk '{print $NF}' file             # Print last column
awk -F: '{print $1}' /etc/passwd   # Custom delimiter

# Conditions
awk '$3 > 50' file                 # Print lines where col 3 > 50
awk '$1 == "value"' file           # Match specific value
awk '/pattern/' file               # Lines matching pattern

# Calculations
awk '{sum += $1} END {print sum}' file                 # Sum column 1
awk '{sum += $1; count++} END {print sum/count}' file  # Average

# Built-in variables
# $0: entire line
# $1, $2, ...: columns
# NR: line number
# NF: number of fields
# FS: field separator

awk 'NR==5' file                   # Print line 5
awk 'NF > 3' file                  # Lines with more than 3 fields
```

### cut (Extract Columns)

```bash
cut -d: -f1 /etc/passwd            # Extract first field (delimiter :)
cut -d: -f1,3 /etc/passwd          # Fields 1 and 3
cut -c1-5 file                     # Characters 1-5
```

### sort & uniq

```bash
# Sort
sort file                          # Sort alphabetically
sort -r file                       # Reverse sort
sort -n file                       # Numeric sort
sort -k2 file                      # Sort by column 2
sort -u file                       # Sort and remove duplicates
sort -t: -k3 -n /etc/passwd        # Sort by column 3 (delimiter :)

# Unique
uniq file                          # Remove consecutive duplicates
uniq -c file                       # Count occurrences
uniq -d file                       # Show only duplicates
sort file | uniq                   # Remove all duplicates
```

### tr (Translate Characters)

```bash
tr 'a-z' 'A-Z' < file              # Lowercase to uppercase
tr -d '0-9' < file                 # Delete all numbers
tr -s ' ' < file                   # Squeeze multiple spaces
```

### wc (Word Count)

```bash
wc file                            # Lines, words, bytes
wc -l file                         # Line count
wc -w file                         # Word count
wc -c file                         # Byte count
```

---

## SSH & Remote Access

### SSH Basics

```bash
# Connect to remote server
ssh user@hostname
ssh user@192.168.1.100
ssh -p 2222 user@hostname          # Custom port

# Execute remote command
ssh user@hostname 'ls -la'
ssh user@hostname 'sudo systemctl restart nginx'

# SSH with key
ssh -i ~/.ssh/private_key user@hostname

# SSH config
~/.ssh/config                      # SSH configuration file

# Example SSH config:
# Host myserver
#     HostName 192.168.1.100
#     User admin
#     Port 2222
#     IdentityFile ~/.ssh/myserver_key

ssh myserver                       # Connect using config
```

### SSH Keys

```bash
# Generate SSH key pair
ssh-keygen                                    # Default (RSA 3072)
ssh-keygen -t ed25519                         # Ed25519 (recommended)
ssh-keygen -t rsa -b 4096                     # RSA 4096-bit
ssh-keygen -t ed25519 -C "email@example.com"  # With comment

# Copy public key to server
ssh-copy-id user@hostname          # Automatic
ssh-copy-id -i ~/.ssh/key.pub user@hostname

# Manual key copy
cat ~/.ssh/id_ed25519.pub | ssh user@hostname 'cat >> ~/.ssh/authorized_keys'

# Test connection
ssh -T user@hostname

# SSH agent
eval $(ssh-agent)                  # Start agent
ssh-add                            # Add default key
ssh-add ~/.ssh/private_key         # Add specific key
ssh-add -l                         # List keys
ssh-add -D                         # Remove all keys
```

### SCP (Secure Copy)

```bash
# Copy local to remote
scp file.txt user@hostname:/path/
scp -r directory user@hostname:/path/

# Copy remote to local
scp user@hostname:/path/file.txt .
scp -r user@hostname:/path/directory .

# Copy between two remote hosts
scp user1@host1:/path/file user2@host2:/path/

# With custom port
scp -P 2222 file.txt user@hostname:/path/

# Preserve attributes
scp -p file.txt user@hostname:/path/
```

### rsync (Better than scp)

```bash
# Basic sync
rsync -avz source/ user@hostname:/dest/

# Sync local to remote
rsync -avz /local/path/ user@hostname:/remote/path/

# Sync remote to local
rsync -avz user@hostname:/remote/path/ /local/path/

# Flags:
# -a: archive mode (recursive, preserve attributes)
# -v: verbose
# -z: compress during transfer
# -P: show progress + keep partial files
# -h: human-readable
# --delete: delete files in dest not in source
# --exclude: exclude pattern

# Common patterns
rsync -avzP source/ dest/                   # With progress
rsync -avz --delete source/ dest/           # Mirror (delete extra)
rsync -avz --exclude='*.log' source/ dest/  # Exclude logs

# Dry run (test without changes)
rsync -avzn source/ dest/
```

### SSH Tunneling

```bash
# Local port forwarding
ssh -L 8080:localhost:80 user@hostname

# Remote port forwarding
ssh -R 8080:localhost:80 user@hostname

# Dynamic port forwarding (SOCKS proxy)
ssh -D 8080 user@hostname

# Keep connection alive
ssh -o ServerAliveInterval=60 user@hostname

# Background SSH tunnel
ssh -fN -L 8080:localhost:80 user@hostname
```

---

## Firewall Management

### UFW (Uncomplicated Firewall - Ubuntu)

```bash
# Enable/disable
sudo ufw enable                    # Enable firewall
sudo ufw disable                   # Disable firewall
sudo ufw status                    # Status
sudo ufw status verbose            # Detailed status
sudo ufw status numbered           # Numbered rules

# Allow/deny
sudo ufw allow 22                  # Allow port 22
sudo ufw allow ssh                 # Allow SSH (port 22)
sudo ufw allow 80/tcp              # Allow TCP port 80
sudo ufw allow 1000:2000/tcp       # Allow port range
sudo ufw allow from 192.168.1.100  # Allow from IP
sudo ufw allow from 192.168.1.0/24 # Allow from subnet
sudo ufw deny 25                   # Deny port 25

# Delete rules
sudo ufw delete allow 80
sudo ufw delete 3                  # Delete rule number 3

# Application profiles
sudo ufw app list                  # List profiles
sudo ufw allow 'Nginx Full'        # Allow Nginx
sudo ufw allow 'OpenSSH'           # Allow SSH

# Reset firewall
sudo ufw reset

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

### firewalld (RHEL/CentOS/Fedora)

```bash
# Service management
sudo systemctl start firewalld
sudo systemctl enable firewalld
sudo firewall-cmd --state          # Check status

# Zones
sudo firewall-cmd --get-zones         # List zones
sudo firewall-cmd --get-default-zone  # Default zone
sudo firewall-cmd --set-default-zone=public
sudo firewall-cmd --get-active-zones

# Services
sudo firewall-cmd --list-all       # List all settings
sudo firewall-cmd --list-services  # List allowed services
sudo firewall-cmd --add-service=http --permanent
sudo firewall-cmd --add-service=https --permanent
sudo firewall-cmd --remove-service=http --permanent

# Ports
sudo firewall-cmd --add-port=8080/tcp --permanent
sudo firewall-cmd --remove-port=8080/tcp --permanent
sudo firewall-cmd --list-ports

# IP addresses
sudo firewall-cmd --add-source=192.168.1.0/24 --permanent
sudo firewall-cmd --remove-source=192.168.1.0/24 --permanent

# Reload firewall
sudo firewall-cmd --reload

# Runtime vs permanent
# Without --permanent: runtime only
# With --permanent: saved but requires reload
```

### iptables (Traditional)

```bash
# List rules
sudo iptables -L                   # List all rules
sudo iptables -L -v -n             # Verbose with numbers
sudo iptables -L INPUT             # List INPUT chain

# Allow traffic
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT    # Allow SSH
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT    # Allow HTTP
sudo iptables -A INPUT -s 192.168.1.100 -j ACCEPT     # Allow from IP

# Block traffic
sudo iptables -A INPUT -s 192.168.1.100 -j DROP       # Block IP
sudo iptables -A INPUT -p tcp --dport 25 -j REJECT    # Reject port

# Delete rule
sudo iptables -D INPUT 3           # Delete rule number 3

# Default policies
sudo iptables -P INPUT DROP        # Default drop incoming
sudo iptables -P FORWARD DROP      # Default drop forwarding
sudo iptables -P OUTPUT ACCEPT     # Default accept outgoing

# Save rules (Debian/Ubuntu)
sudo iptables-save > /etc/iptables/rules.v4

# Save rules (RHEL/CentOS)
sudo service iptables save

# Flush all rules
sudo iptables -F                   # Flush all chains
sudo iptables -X                   # Delete all chains
```

---

## Common Aliases

Add these to your `~/.bashrc` or `~/.zshrc`:

```bash
# Navigation
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'

# ls aliases
alias ll='ls -lah'
alias la='ls -A'
alias l='ls -CF'

# Safety
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

# System
alias update='sudo apt update && sudo apt upgrade'  # Debian/Ubuntu
alias ports='netstat -tulanp'
alias psmem='ps auxf | sort -nr -k 4 | head -10'
alias pscpu='ps auxf | sort -nr -k 3 | head -10'

# Docker
alias dps='docker ps'
alias dpsa='docker ps -a'
alias dim='docker images'
alias dex='docker exec -it'
alias dlogs='docker logs -f'

# Kubernetes
alias k='kubectl'
alias kgp='kubectl get pods'
alias kgs='kubectl get services'
alias kgd='kubectl get deployments'
alias kdp='kubectl describe pod'
alias kl='kubectl logs -f'

# Git
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline'
alias gd='git diff'
```

---

## Keyboard Shortcuts

### Bash/Zsh Shortcuts

```bash
# Navigation
Ctrl+A          # Move to beginning of line
Ctrl+E          # Move to end of line
Ctrl+B          # Move backward one character
Ctrl+F          # Move forward one character
Alt+B           # Move backward one word
Alt+F           # Move forward one word

# Editing
Ctrl+U          # Delete from cursor to beginning
Ctrl+K          # Delete from cursor to end
Ctrl+W          # Delete word before cursor
Alt+D           # Delete word after cursor
Ctrl+Y          # Paste deleted text
Ctrl+T          # Swap last two characters
Alt+T           # Swap last two words

# Control
Ctrl+C          # Kill current process
Ctrl+Z          # Suspend current process
Ctrl+D          # Exit current shell
Ctrl+L          # Clear screen
Ctrl+R          # Search command history
Ctrl+S          # Stop output
Ctrl+Q          # Resume output

# History
!!              # Repeat last command
!string         # Repeat last command starting with string
!$              # Last argument of previous command
!*              # All arguments of previous command
```

---

## Quick Reference Tables

### File Permissions (Numeric)

| Number | Permission | Symbolic |
|--------|-----------|----------|
| 0 | No permission | --- |
| 1 | Execute | --x |
| 2 | Write | -w- |
| 3 | Write + Execute | -wx |
| 4 | Read | r-- |
| 5 | Read + Execute | r-x |
| 6 | Read + Write | rw- |
| 7 | Read + Write + Execute | rwx |

### Common Ports

| Port | Service |
|------|---------|
| 20/21 | FTP |
| 22 | SSH |
| 23 | Telnet |
| 25 | SMTP |
| 53 | DNS |
| 80 | HTTP |
| 110 | POP3 |
| 143 | IMAP |
| 443 | HTTPS |
| 3306 | MySQL |
| 5432 | PostgreSQL |
| 6379 | Redis |
| 8080 | HTTP (alternate) |
| 27017 | MongoDB |

### Signal Numbers

| Signal | Number | Description |
|--------|--------|-------------|
| SIGHUP | 1 | Hangup (reload config) |
| SIGINT | 2 | Interrupt (Ctrl+C) |
| SIGQUIT | 3 | Quit |
| SIGKILL | 9 | Force kill (cannot be caught) |
| SIGTERM | 15 | Terminate (default) |
| SIGSTOP | 19 | Stop process |
| SIGCONT | 18 | Continue process |

---

## Distribution-Specific Commands

### Package Manager Summary

| Distribution | Package Manager | Commands |
|-------------|----------------|----------|
| Debian/Ubuntu | APT | `apt install`, `apt update` |
| RHEL/CentOS 7 | YUM | `yum install`, `yum update` |
| RHEL/CentOS 8+ | DNF | `dnf install`, `dnf update` |
| Fedora | DNF | `dnf install`, `dnf update` |
| Arch Linux | Pacman | `pacman -S`, `pacman -Syu` |
| openSUSE | Zypper | `zypper install`, `zypper update` |
| Alpine Linux | APK | `apk add`, `apk update` |

### Init System

| Distribution | Init System | Service Command |
|-------------|------------|-----------------|
| Ubuntu 16.04+ | systemd | `systemctl` |
| Debian 8+ | systemd | `systemctl` |
| RHEL/CentOS 7+ | systemd | `systemctl` |
| RHEL/CentOS 6 | Upstart/SysVinit | `service` |
| Debian 7 | SysVinit | `service` |

---

**Tip:** Use `man COMMAND` or `COMMAND --help` to get detailed information about any command!

---
title: 🐧 Disk Management in Linux
---

# Disk Management in Linux

---

## Table of Contents

1. [Brief Explanation](#brief-explanation)
2. [Display Devices](#1-display-devices)
3. [Partitioning](#2-partitioning)
4. [Create Filesystem](#3-create-filesystem)
5. [Mounting](#4-mounting)
6. [Persistent Mounting with /etc/fstab](#persistent-mounting-with-etcfstab)
7. [Encryption](#5-encryption)
8. [Monitoring & Error Checking](#6-monitoring--error-checking)
9. [RAID & LVM (optional)](#7-raid--lvm-optional)
10. [Tips](#8-tips)
11. [Further Links](#further-links)

---

## Brief Explanation

Disk management includes partitioning, formatting, mounting, monitoring, and optionally encrypting storage devices on Linux.

**Platform Notes:**

- RHEL/Debian/Ubuntu: `fdisk`, `parted`, `lsblk`, `blkid` available by default
- Alpine: Minimal, may require installation via `apk add util-linux e2fsprogs`
- macOS: Different tools (`diskutil`) – syntax differs

---

## 1. Display Devices

| Command     | Explanation                                       |
|-------------|---------------------------------------------------|
| `lsblk`     | Shows block devices and partitions                |
| `blkid`     | Shows UUID, filesystem type                       |
| `fdisk -l`  | Detailed partition table                          |
| `parted -l` | Partition table (MBR/GPT)                         |
| `df -h`     | Used space on mounted devices                     |
| `mount`     | Currently mounted filesystems                     |

| Example             | Explanation                       |
|---------------------|-----------------------------------|
| `lsblk -f`          | With filesystems and UUIDs        |
| `blkid /dev/sda1`   | Info about a partition            |
| `fdisk -l /dev/sda` | Show partitions of a disk         |

---

## 2. Partitioning

| Command           | Explanation                         |
|-------------------|-------------------------------------|
| `fdisk /dev/sdX`  | Interactive MBR partitioning        |
| `parted /dev/sdX` | Interactive GPT/MBR partitioning    |
| `gdisk /dev/sdX`  | GPT partitioning                    |
| `cfdisk /dev/sdX` | Menu-based partitioning             |

| Example                                       | Explanation                         |
|-----------------------------------------------|-------------------------------------|
| `fdisk /dev/sdb`                              | Create/modify partition on /dev/sdb |
| `parted /dev/sdb mklabel gpt`                 | New GPT table                       |
| `parted /dev/sdb mkpart primary ext4 0% 100%` | Create partition                    |
| `gdisk /dev/sdb`                              | GPT partitioning interactive        |

**Note:** After changes, reload partition table: `partprobe /dev/sdX`

---

## 3. Create Filesystem

| Command                | Explanation      |
|------------------------|------------------|
| `mkfs.ext4 /dev/sdX1`  | Ext4 filesystem  |
| `mkfs.xfs /dev/sdX1`   | XFS              |
| `mkfs.vfat /dev/sdX1`  | FAT32            |
| `mkfs.ntfs /dev/sdX1`  | NTFS             |
| `mkfs.btrfs /dev/sdX1` | Btrfs            |

| Example                     | Explanation         |
|-----------------------------|---------------------|
| `mkfs.ext4 /dev/sdb1`       | Ext4 on /dev/sdb1   |
| `mkfs.xfs /dev/sdb1`        | Create XFS          |
| `mkfs.vfat -F 32 /dev/sdb1` | FAT32 for USB stick |

---

## 4. Mounting

| Command                                 | Explanation        |
|-----------------------------------------|--------------------|
| `mount /dev/sdX1 /mnt`                  | Mount partition    |
| `umount /mnt`                           | Unmount            |
| `mkdir /mnt/data`                       | Create mountpoint  |
| `mount -o defaults /dev/sdb1 /mnt/data` | Set options        |

| Example                      | Explanation             |
|------------------------------|-------------------------|
| `mount /dev/sdb1 /mnt`       | Mount                   |
| `umount /mnt`                | Unmount                 |
| `mount -o rw /dev/sdb1 /mnt` | Explicit write access   |

## Persistent Mounting with /etc/fstab

### About /etc/fstab

To mount a partition automatically at system boot, it is added to the `/etc/fstab` file.
`fstab` stands for "File System Table" and contains all devices, mountpoints, filesystem types, and options.

---

## Syntax of an Entry

| Field           | Description                                                                   |
|-----------------|-------------------------------------------------------------------------------|
| `<Device>`      | Device or UUID of partition, e.g., `/dev/sdb1` or `UUID=xxxx-xxxx`           |
| `<Mountpoint>`  | Directory where partition is mounted, e.g., `/mnt/data`                       |
| `<Filesystem>`  | Type of filesystem, e.g., `ext4`, `xfs`, `vfat`                               |
| `<Options>`     | Mount options, e.g., `defaults`, `rw`, `noatime`, `user`                      |
| `<Dump>`        | Backup option (0 = no, 1 = yes, rarely used)                                  |
| `<Pass>`        | Order for `fsck` at boot (0 = don't check, 1 = root, 2 = others)             |

---

## Example

UUID=123e4567-e89b-12d3-a456-426614174000 /mnt/data ext4 defaults 0 2

**Explanation:**

- `UUID=123e4567-e89b-12d3-a456-426614174000` -> unique identifier of partition
- `/mnt/data` -> directory where it's mounted
- `ext4` -> filesystem type
- `defaults` -> default options (rw, suid, dev, exec, auto, nouser, async)
- `0` -> partition is not backed up by `dump`
- `2` -> order of checking at boot (`fsck` checks root first with 1, other partitions with 2)

---

## Commonly Used Options

| Option     | Meaning                                                     |
|------------|-------------------------------------------------------------|
| `defaults` | Default options (rw, suid, dev, exec, auto, nouser, async)  |
| `rw`       | Read/write access                                           |
| `ro`       | Read-only access                                            |
| `noauto`   | Partition not automatically mounted at boot                 |
| `user`     | Any user can mount                                          |
| `nouser`   | Only root can mount                                         |
| `exec`     | Allow program execution                                     |
| `noexec`   | Execution not allowed                                       |
| `sync`     | Execute write operations synchronously                      |
| `async`    | Write operations asynchronous (default)                     |
| `noatime`  | Don't update access time on file read operations            |

---

## Tips

- Use UUID instead of `/dev/sdX` as device designation can change at boot
- Test after changes to `fstab`: `sudo mount -a` (checks all entries without reboot)
- Always create backup of original `fstab`: `sudo cp /etc/fstab /etc/fstab.bak`
- For LUKS-encrypted partitions, decryption must occur before mount (e.g., via `crypttab`)

---

## 5. Encryption

| Method          | Explanation                                       |
|-----------------|---------------------------------------------------|
| `LUKS/dm-crypt` | Encrypt entire partition                          |
| `ecryptfs`      | Encrypt home directory                            |
| `fscrypt`       | Encryption at filesystem level (ext4, f2fs)       |

### LUKS Example

| Command                                    | Explanation             |
|--------------------------------------------|-------------------------|
| `cryptsetup luksFormat /dev/sdb1`          | Encrypt partition       |
| `cryptsetup open /dev/sdb1 securedata`     | Open partition          |
| `mkfs.ext4 /dev/mapper/securedata`         | Create filesystem       |
| `mount /dev/mapper/securedata /mnt/secure` | Mount                   |
| `cryptsetup close securedata`              | Unmount & close         |

---

## 6. Monitoring & Error Checking

| Command                | Explanation                         |
|------------------------|-------------------------------------|
| `df -h`                | Used space                          |
| `du -sh /mnt/data`     | Space usage of a directory          |
| `lsblk -f`             | Check filesystem & UUID             |
| `fsck /dev/sdX1`       | Check/repair filesystem             |
| `smartctl -a /dev/sdX` | SMART data for hard drives          |

| Example                      | Explanation          |
|------------------------------|----------------------|
| `fsck -y /dev/sdb1`          | Automatic repair     |
| `smartctl -t short /dev/sda` | SMART short test     |
| `smartctl -a /dev/sda`       | SMART report         |

---

## 7. RAID & LVM (optional)

| Command                               | Explanation                       |
|---------------------------------------|-----------------------------------|
| `mdadm`                               | Create/manage software RAID       |
| `pvcreate /dev/sdb1`                  | LVM Physical Volume               |
| `vgcreate vgname /dev/sdb1 /dev/sdc1` | Volume Group                      |
| `lvcreate -L 10G -n lvdata vgname`    | Create Logical Volume             |
| `lvextend -L +5G /dev/vgname/lvdata`  | Extend Logical Volume             |
| `resize2fs /dev/vgname/lvdata`        | Extend filesystem                 |

| Example                                                                          | Explanation         |
|----------------------------------------------------------------------------------|---------------------|
| `mdadm --create --verbose /dev/md0 --level=1 --raid-devices=2 /dev/sdb /dev/sdc` | Create RAID1        |
| `lvcreate -L 50G -n home vg01`                                                   | LVM Logical Volume  |
| `lvextend -L +10G /dev/vg01/home`                                                | Extend LV           |
| `resize2fs /dev/vg01/home`                                                       | Adjust FS           |

---

## 8. Tips

- Always backup before changing partitions or LUKS
- Check `lsblk`, `blkid` & `df` regularly
- For LVM + LUKS + RAID: Work step by step and document
- For USB sticks: Use `sync` after write operations
- Partition tables: Note MBR vs GPT (`fdisk` = MBR, `gdisk`/`parted` = GPT possible)

---

## Further Links

- [Linux Filesystem Hierarchy](https://www.pathname.com/fhs/pub/fhs-2.3.html)
- [LVM Howto](https://tldp.org/HOWTO/LVM-HOWTO/)
- [LUKS/dm-crypt](https://gitlab.com/cryptsetup/cryptsetup)
- `man fdisk`, `man parted`, `man mkfs`, `man cryptsetup`, `man lvm`

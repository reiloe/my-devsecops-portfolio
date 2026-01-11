---
title: 🐧 User Permissions
---

# User Permissions

In Linux, **user permissions** are managed through **users, groups, and file permissions**. Each object (file, directory) has an owner, a group, and permissions for "others" (everyone else).

---

## Table of Contents

1. [Fundamentals](#1-fundamentals)
2. [Displaying Permissions](#2-displaying-permissions)
3. [Changing Permissions (`chmod`)](#3-changing-permissions-chmod)
4. [Changing Owner (`chown`) and Group (`chgrp`)](#4-changing-owner-chown-and-group-chgrp)
5. [Special Permissions](#5-special-permissions)
6. [Examples of Typical Scenarios](#6-examples-of-typical-scenarios)
7. [Summary](#7-summary)

---

## 1. Fundamentals

- **User**: e.g., `max`
- **Group**: e.g., `developers`
- **File permissions**: `r` (read), `w` (write), `x` (execute)
- **Permissions** are assigned in three categories:
    1. **User (u)** -> Owner of the file
    2. **Group (g)** -> Members of the group
    3. **Others (o)** -> All other users

### Example

-rwxr-xr--  

- `-` -> File (`d` would be directory)
- `rwx` -> User permissions: read, write, execute
- `r-x` -> Group permissions: read, execute
- `r--` -> Others permissions: read only

---

## 2. Displaying Permissions

```bash
ls -l myfile.txt

-rw-r--r-- 1 max developers 1024 Sep 27 12:00 myfile.txt
```

- Owner: `max`
- Group: `developers`
- Permissions:
  - User: `rw-` (read + write)
  - Group: `r--` (read)
  - Others: `r--` (read)

---

## 3. Changing Permissions (`chmod`)

**Symbolic Notation:**

```bash
chmod u+x myfile.txt    # adds execute permission for User  
chmod g+w myfile.txt    # adds write permission for Group  
chmod o-r myfile.txt    # removes read permission for Others
```

**Numeric Notation:**

- `r = 4`, `w = 2`, `x = 1`
- Sum for each category (User/Group/Others)

```bash
chmod 754 myfile.txt

# User: 7 = r(4)+w(2)+x(1) -> rwx
# Group: 5 = r(4)+x(1) -> r-x
# Others: 4 = r(4) -> r--
```

---

## 4. Changing Owner (`chown`) and Group (`chgrp`)

```bash
chown bob myfile.txt      # change owner to bob  
chgrp admins myfile.txt   # change group to admins  
chown bob:admins myfile.txt  # change user and group simultaneously
```

---

## 5. Special Permissions

1. **Setuid (s)**: Programs run with the permissions of the owner

```bash
chmod u+s myprogram  
ls -l myprogram
# -rwsr-xr-x 1 root root 12345 Sep 27 12:00 myprogram
```

2. **Setgid (s)**: New files inherit the group membership of the directory

```bash
chmod g+s mydir  
ls -ld mydir
# drwxr-sr-x 2 max developers 4096 Sep 27 12:00 mydir
```

3. **Sticky Bit (t)**: Only the owner can delete files in a shared directory

```bash
chmod +t /tmp/shared  
ls -ld /tmp/shared
# drwxrwxrwt 2 root root 4096 Sep 27 12:00 /tmp/shared
```

---

## 6. Examples of Typical Scenarios

### Example 1: Personal File

```bash
-rw------- 1 max max 1024 Sep 27 12:00 secret.txt
```

- Only `max` can read/write, no one else.

### Example 2: Shared Project Directory

```bash
drwxrwsr-x 2 max developers 4096 Sep 27 12:00 project
```

- `setgid` is set -> new files automatically belong to the group `developers`.
- User `max` has full access, group members can write and execute.

### Example 3: Public Temp Folder

```bash
drwxrwxrwt 10 root root 4096 Sep 27 12:00 /tmp
```

- Sticky Bit -> users can only delete their own files.

---

## 7. Summary

- Permissions are controlled via **User/Group/Others**.
- `chmod` changes permissions, `chown` changes owner, `chgrp` changes group.
- Setuid, Setgid, and Sticky Bit enable special permission inheritance and security.
- For shared projects and temporary directories, Setgid and Sticky Bit are useful.

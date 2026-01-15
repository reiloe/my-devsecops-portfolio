---
title: "🐧 Here-Documents in Linux: EOF and Variants"
---

# Here-Documents in Linux: EOF and Variants

## Table of Contents

1. [Concept](#1-concept)
2. [Examples](#2-examples)
3. [Typical Use Cases](#3-typical-use-cases)
4. [Variants and Behavior](#4-variants-and-behavior)
5. [Summary](#5-summary)

---

## 1. Concept

- A **Here-Document** passes **multi-line input directly to a command**.
- Syntax:

```text
Command << MARKER  
Content Line 1  
Content Line 2  
MARKER
```

- `MARKER` can be chosen arbitrarily (not just `EOF`).
- The end of the Here-Document is reached when the marker appears **alone on a line**.
- The standard marker is often `EOF` (End Of File) because it's easy to remember, but any string works.

---

## 2. Examples

### Example 1: Standard `EOF`

```bash
cat << EOF  
This is line 1  
This is line 2  
EOF
```

- Passes the two lines directly to `cat`.
- Output:

This is line 1  
This is line 2

---

### Example 2: Different Marker

```bash
cat << END  
Hello World  
Test line  
END
```

- Here `END` is used as the marker.
- Advantage: Clear context in the script or when `EOF` is already used elsewhere.

---

### Example 3: Variables and Expansion

#### With Expansion (Default Behavior)

```bash
NAME="Max"  
cat << EOF  
Hello $NAME  
EOF
```

- `$NAME` is **replaced with its value**.
- Output:

Hello Max

#### Without Expansion (`<<'EOF'`)

```bash
NAME="Max"  
cat << 'EOF'  
Hello $NAME  
EOF
```

- By using **single quotes around the marker**, the variable is **not expanded**.
- Output:

Hello $NAME

#### Without Backslash Interpretation (`<<\EOF`)

```bash
cat <<\EOF  
This is a line\nThis is another  
EOF
```

- Backslashes are **not interpreted**, everything is taken literally.
- Output:

This is a line\nThis is another

---

## 3. Typical Use Cases

### 3.1 Multi-line Input for Scripts

```bash
mysql -u user -p database << EOF  
CREATE TABLE test (id INT, name VARCHAR(50));  
INSERT INTO test VALUES (1, 'Max');  
EOF
```

- Here the SQL command is **passed directly to MySQL**.
- Advantage: No temporary file needed.
- Process: Shell reads everything between `<< EOF` and `EOF` -> outputs it to the standard input of `mysql`.

### 3.2 Generating Configuration Files

```bash
cat << CONFIG > app.conf  
[server]  
port=8080  
host=127.0.0.1  
CONFIG
```

- Explanation:
  - `cat` reads everything between `<< CONFIG` and `CONFIG`.
  - `>` redirects the output to `app.conf`.
  - Result: A new configuration file is created without having to write it manually.
- Advantage: Ideal for automated scripts or deployments.

### 3.3 Inline Scripts for Other Programs

```bash
python3 << PYTHON  
print("Hello from Python")  
x = 5  
print(x*2)  
PYTHON
```

- Explanation:
  - Everything between `<< PYTHON` and `PYTHON` is passed to the standard input of `python3`.
  - Python interprets the input directly.
- Advantage: Short scripts can be executed directly in shell scripts without creating a separate `.py` file.

---

## 4. Variants and Behavior

| Variant          | Variable Expansion | Backslash Interpretation | Example                                                      |
|------------------|--------------------|--------------------------|------------------------------------------------------------- |
| `<< MARKER`      | Yes                | Yes                      | Standard, `$VAR` is replaced, `\n` interpreted               |
| `<< 'MARKER'`    | No                 | No                       | Variables are not replaced, backslashes remain literal       |
| `<<\MARKER`      | Yes                | No                       | Variables are replaced, backslashes remain literal           |

---

## 5. Summary

- `<< MARKER` = Here-Document, passes everything up to `MARKER` to the command.
- `MARKER` is freely selectable (`EOF`, `END`, `CONFIG`, `PYTHON` ...).
- `'MARKER'` -> no variable expansion.
- `\MARKER` -> no escape interpretation.
- Very practical for:
  - Automated creation of **configuration files**
  - **Inline scripts** for programs (Python, SQL, Bash)
  - **Test data** or temporary input, without creating files

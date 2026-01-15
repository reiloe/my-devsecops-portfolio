---
title: 📄 jq Command
---

# jq Command

**Brief:** `jq` is a powerful command-line tool for parsing, filtering, transforming, and formatting JSON data. It is particularly useful for logs, APIs, NDJSON, and complex JSON structures. This guide covers the basics through advanced topics and best practices.

---

## Table of Contents

1. [Installation](#1-installation)
2. [Basics & Syntax](#2-basics--syntax)
3. [Filters & Operators](#3-filters--operators)
4. [Manipulating Objects & Arrays](#4-manipulating-objects--arrays)
5. [Conditional Filters & select()](#5-conditional-filters--select)
6. [Variables, Functions & Recursion](#6-variables-functions--recursion)
7. [Pipes & Streams](#7-pipes--streams)
8. [Search & Aggregate](#8-search--aggregate)
9. [Output Formatting](#9-output-formatting)
10. [Streams & Large Files](#10-streams--large-files)
11. [Real-World Examples](#11-real-world-examples)
12. [Best Practices](#12-best-practices)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Installation

### Linux

```bash
sudo apt-get install jq       # Debian/Ubuntu
sudo yum install jq           # CentOS/RHEL
sudo pacman -S jq             # Arch Linux
```

### macOS

```bash
brew install jq
```

### Windows

- [jq Windows binaries](https://stedolan.github.io/jq/download/)
- Or via [chocolatey](https://chocolatey.org/):

  ```powershell
  choco install jq
  ```

---

## 2. Basics & Syntax

```bash
jq <filter> file.json
```

- **Filter**: Determines which parts of the JSON are displayed.
- **-r**: Raw output (no JSON string).
- **.**: Root object.
- **[]**: Array indexing or filter.

Example:

```json
{ "user": { "id": 1, "name": "Anna", "roles": ["admin","user"] } }
```

```bash
jq '.user.name' file.json
jq -r '.user.name' file.json
jq '.user.roles[0]' file.json
```

---

## 3. Filters & Operators

- **.key**: Access object properties
- **.[]**: Iterate array elements
- **|**: Pipe, forward to next filter
- **,**: Multiple outputs
- **[]**: Index or slice `[start:end]`

Examples:

```bash
jq '.users[] | .name' users.json
jq '.items[0:3]' items.json
jq '.user.roles | length' users.json
```

---

## 4. Manipulating Objects & Arrays

- **Create objects:** `{ "key": value }`
- **Create arrays:** `[1,2,3]`
- **map()**: Transform each element in array
- **add**: Sum / merge array values

Examples:

```bash
jq '.users | map(.id)' users.json
jq '[.items[] | .price] | add' orders.json
jq '.users[] | {username: .name, email: .email}' users.json
```

---

## 5. Conditional Filters & select()

- `select(condition)` filters elements based on conditions.
- Combine with `map` and `[]` for arrays.

Examples:

```bash
jq '.users[] | select(.active==true) | .name' users.json
jq '.items[] | select(.price>10) | {name:.name,price:.price}' items.json
```

---

## 6. Variables, Functions & Recursion

- `--arg name value`: Pass string variables
- `--argjson name value`: Pass JSON variables
- `def fname(params): expression;` defines functions
- Recursion with `recurse` for nested structures

Examples:

```bash
jq --arg min "10" '.items[] | select(.price>($min|tonumber))' items.json
jq 'def double(x): x*2; [1,2,3] | map(double(.))'
jq 'recurse(.children[]?) | .name' nested.json
```

---

## 7. Pipes & Streams

- Use `|` for chaining operations
- Streams: `jq -c` compact output (NDJSON), good for logs

Example:

```bash
jq -c '.events[] | {ts:.timestamp, event:.type}' events.json
```

- Output or process NDJSON:
  
```bash
cat logs.ndjson | jq '. | select(.level=="error")'
```

---

## 8. Search & Aggregate

- `group_by(.key)` and `map()`
- `length`, `min`, `max`, `add`, `unique`

Examples:

```bash
jq 'group_by(.category) | map({category:.[0].category, count: length})' items.json
jq '[.numbers[]] | add / length' stats.json
```

---

## 9. Output Formatting

- `-r` raw
- `-c` compact
- Pretty Print: default output

Examples:

```bash
jq '.' file.json > pretty.json
jq -c '.' file.json > compact.json
jq -r '.user.name' file.json
```

---

## 10. Streams & Large Files

- `jq -c` + Pipes -> NDJSON
- No memory overload through `cat big.json | jq -c '.items[]'`
- For extremely large data: combine with `split`, `parallel`, or `xargs`

---

## 11. Real-World Examples

### Filter Logs

```bash
cat app_logs.ndjson | jq -c 'select(.level=="error") | {ts:.ts,msg:.msg}'
```

### API Response

```bash
curl -s https://api.example.com/users | jq '.data[] | {id:.id,name:.name}'
```

### Aggregation

```bash
jq '[.items[].price] | add' orders.json
```

### Nested Structures

```bash
jq 'recurse(.children[]?) | select(.type=="folder") | .name' nested.json
```

---

## 12. Best Practices

- Use **compact formats for logs** (`-c`).
- Use **NDJSON** for streaming.
- Pass variables via `--arg` / `--argjson`, not string concatenation.
- Check JSON beforehand with `jq '.'` for syntax errors.
- Use pipes to keep transformations modular.
- Document complex jq filters for team members.

---

## 13. Troubleshooting

- **Invalid JSON:** `jq` returns error + line info.
- **Empty Arrays:** Check paths with `| length` or debug with `.`.
- **NDJSON Issues:** Use `jq -c '.' file.ndjson`.
- **Large Files:** Split or stream, don't load everything at once.

---

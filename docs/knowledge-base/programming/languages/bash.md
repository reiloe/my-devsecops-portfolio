---
title: 🐚 Bash Scripting
---

# 🧩 Bash Scripting

**Bash (Bourne Again SHell)** is the default shell in most Linux and macOS systems.  
With Bash scripting, you can efficiently perform **automation, system administration, DevOps tasks, CI/CD jobs**, and **file processing**.

---

## Table of Contents

1. [Basics](#basics)
2. [Variables](#variables)
3. [Data Types & Arrays](#data-types--arrays)
4. [Control Structures](#control-structures)
5. [Functions](#functions)
6. [Input/Output & Pipes](#inputoutput--pipes)
7. [String Manipulation](#string-manipulation)
8. [Parameters & Arguments](#parameters--arguments)
9. [Exit Codes & Error Handling](#exit-codes--error-handling)
10. [File Processing](#file-processing)
11. [Debugging & Logging](#debugging--logging)
12. [Examples](#examples)
13. [Best Practices](#best-practices)
14. [Resources](#resources)

---

## Basics

### a) Shebang

The first line of a script specifies the shell:

```bash
#!/bin/bash
```

- `#!/bin/bash` – Standard Bash shell
- `#!/usr/bin/env bash` – More flexible, searches for Bash in PATH

### b) Make script executable

```bash
chmod +x script.sh
./script.sh
```

---

## Variables

### a) Declaration

```bash
NAME="Max"
AGE=42
```

- No spaces before or after `=`
- Access: `$NAME`, `$AGE`

### b) Improve readability

```bash
echo "Name: $NAME, Age: $AGE"
```

### c) Read user input

```bash
read -p "Enter your name: " USERNAME
echo "Hello, $USERNAME!"
```

---

## Data Types & Arrays

- All variables are strings, Bash converts as needed
- **Array example:**

```bash
FRUITS=("Apple" "Banana" "Cherry")
echo ${FRUITS[0]}    # Apple
echo ${FRUITS[@]}    # All
FRUITS+=("Orange")   # Add element
```

- **Loop over array:**

```bash
for fruit in "${FRUITS[@]}"; do
  echo "Fruit: $fruit"
done
```

---

## Control Structures

### a) If/Else

```bash
X=10
if [ $X -gt 5 ]; then
  echo "Greater than 5"
elif [ $X -eq 5 ]; then
  echo "Exactly 5"
else
  echo "Less than 5"
fi
```

- Comparison operators:
  - `-eq`, `-ne`, `-lt`, `-le`, `-gt`, `-ge`
  - Strings: `=`, `!=`, `<`, `>`

### b) Case

```bash
COLOR="red"
case $COLOR in
  "red")
    echo "Stop"
    ;;
  "green")
    echo "Go"
    ;;
  *)
    echo "Unknown"
    ;;
esac
```

### c) Loops

#### For Loop (Range)

```bash
for i in {1..5}; do
  echo "Number $i"
done
```

#### For Loop (Array)

```bash
for fruit in "${FRUITS[@]}"; do
  echo $fruit
done
```

#### While Loop

```bash
COUNTER=1
while [ $COUNTER -le 5 ]; do
  echo $COUNTER
  ((COUNTER++))
done
```

---

## Functions

### a) Definition & Call

```bash
greet() {
  echo "Hello, $1!"
}

greet "Max"   # Parameter $1
```

### b) Return value

```bash
add() {
  local sum=$(( $1 + $2 ))
  echo $sum
}

result=$(add 3 5)
echo "Sum: $result"
```

---

## Input/Output & Pipes

### a) Output

```bash
echo "Hello World"
printf "Name: %s\n" "$NAME"
```

### b) Input

```bash
read -p "Enter age: " AGE
```

### c) Pipes & Redirection

```bash
ls -l | grep ".txt" > files.txt
cat files.txt
```

- `>` = overwrite
- `>>` = append
- `2>` = redirect error output

---

## String Manipulation

```bash
STR="Hello World"
echo ${STR:0:5}     # Hello
echo ${STR#* }      # World (remove everything up to first space)
echo ${STR,,}       # hello world (lowercase)
echo ${STR^^}       # HELLO WORLD (uppercase)
```

---

## Parameters & Arguments

- `$0` = Script name
- `$1` … `$n` = first to nth arguments
- `$@` = all arguments
- `$#` = number of arguments

```bash
echo "Script: $0"
echo "First argument: $1"
echo "All: $@"
```

---

## Exit Codes & Error Handling

- Every Bash command returns an exit code (`0 = success`)
- Access via `$?`

```bash
ls /tmp
echo "Exit Code: $?"

# Condition based on exit code
if [ $? -eq 0 ]; then
  echo "Success"
fi
```

- Abort script on error:

```bash
set -e   # stops on any error
set -u   # error on unset variables
```

---

## File Processing

### a) Iterate over files

```bash
for file in /tmp/*.log; do
  echo "File: $file"
done
```

### b) Read file line by line

```bash
while IFS= read -r line; do
  echo $line
done < input.txt
```

---

## Debugging & Logging

- Enable debugging: `set -x`
- Logging:

```bash
LOGFILE="script.log"
echo "Starting script" >> $LOGFILE
```

- `trap` for errors & cleanup:

```bash
trap 'echo "Error occurred"; exit 1' ERR
```

---

## Examples

### a) Backup Script

```bash
#!/bin/bash
SRC="/home/user/data"
DEST="/backup"
DATE=$(date +%F)

tar -czf $DEST/backup-$DATE.tar.gz $SRC
echo "Backup created: $DEST/backup-$DATE.tar.gz"
```

### b) Healthcheck Script

```bash
#!/bin/bash
URL="http://localhost:8080"
if curl -s --head $URL | grep "200 OK" > /dev/null; then
  echo "$URL is running"
else
  echo "$URL DOWN"
fi
```

### c) Log Parser

```bash
#!/bin/bash
LOGFILE=$1
ERRORS=0
WARNINGS=0

while IFS= read -r line; do
  [[ $line == *"ERROR"* ]] && ((ERRORS++))
  [[ $line == *"WARN"* ]] && ((WARNINGS++))
done < "$LOGFILE"

echo "Errors: $ERRORS, Warnings: $WARNINGS"
```

---

## Best Practices

- Use **`#!/usr/bin/env bash`** for portability
- Write **comments**: `#`
- **Variables in uppercase** for global variables
- **set -euo pipefail** for robust scripting
- Modularize with **functions**
- Enable **debugging** with `set -x`
- Always use **logging** to file for CI/CD pipelines

---

## Resources

- Bash Reference Manual: [https://www.gnu.org/software/bash/manual/](https://www.gnu.org/software/bash/manual/)
- Bash Scripting Guide: [https://tldp.org/LDP/Bash-Beginners-Guide/html/](https://tldp.org/LDP/Bash-Beginners-Guide/html/)
- Advanced Bash-Scripting Guide: [https://tldp.org/LDP/abs/html/](https://tldp.org/LDP/abs/html/)

---

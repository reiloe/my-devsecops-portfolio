---
title: 🐧 Vi / Vim
---

# Vi / Vim

---

## Table of Contents

1. [Brief Explanation](#brief-explanation)
2. [Modes](#modes)
3. [Normal Mode – Navigation](#normal-mode--navigation)
4. [Insert / Edit](#insert--edit)
5. [Delete / Change / Copy Text](#delete--change--copy-text)
6. [Search & Replace](#search--replace)
7. [Save / Exit Files](#save--exit-files)
8. [Useful Extras](#useful-extras)
9. [Practical Tips](#practical-tips)
10. [Resources](#resources)

---

## Brief Explanation

`vi` (or `vim`) is a command-line text editor available on all Unix/Linux/macOS systems.  
Vim is the enhanced version of vi with additional features like syntax highlighting, tabs, and plugins.

**Platform Notes:**

- Linux: RHEL/Debian/Alpine include vi or vim minimal
- macOS: Standard `vi` is usually an alias for `vim`
- Windows: `gvim` or available via WSL/Unix tools

---

## Modes

| Mode             | Purpose               | Switch                         |
|------------------|-----------------------|--------------------------------|
| **Normal**       | Execute commands      | Default after start, `Esc`     |
| **Insert**       | Insert text           | `i`, `I`, `a`, `A`, `o`, `O`   |
| **Visual**       | Select text           | `v`, `V`, `Ctrl-v` (Block)     |
| **Command-line** | Special commands      | `:` (Save, Quit, Search, etc.) |

---

## Normal Mode – Navigation

| Command   | Explanation                            |
|-----------|----------------------------------------|
| `h`       | Cursor left                            |
| `j`       | Cursor down                            |
| `k`       | Cursor up                              |
| `l`       | Cursor right                           |
| `0`       | To beginning of line                   |
| `^`       | To first non-whitespace character      |
| `$`       | To end of line                         |
| `gg`      | To beginning of file                   |
| `G`       | To end of file                         |
| `{` / `}` | To beginning/end of next paragraph     |
| `w`       | To next word beginning                 |
| `e`       | To word end                            |
| `b`       | To word beginning                      |

---

## Insert / Edit

| Command | Explanation                    |
|---------|--------------------------------|
| `i`     | Insert before cursor           |
| `I`     | Insert at beginning of line    |
| `a`     | Insert after cursor            |
| `A`     | Insert at end of line          |
| `o`     | New line below current         |
| `O`     | New line above current         |

---

## Delete / Change / Copy Text

| Command  | Explanation                         |
|----------|-------------------------------------|
| `x`      | Delete character                    |
| `X`      | Delete character left of cursor     |
| `dw`     | Delete word                         |
| `d$`     | Delete to end of line               |
| `dd`     | Delete entire line                  |
| `dG`     | Delete to end of file               |
| `u`      | Undo                                |
| `Ctrl-r` | Redo                                |
| `yy`     | Copy line                           |
| `p`      | Paste after cursor                  |
| `P`      | Paste before cursor                 |
| `>`, `<` | Indent/unindent line                |

---

## Search & Replace

| Command          | Explanation                         |
|------------------|-------------------------------------|
| `/pattern`       | Search forward                      |
| `?pattern`       | Search backward                     |
| `n`              | Next occurrence                     |
| `N`              | Previous occurrence                 |
| `:%s/old/new/g`  | Replace all occurrences             |
| `:%s/old/new/gc` | Replace with confirmation           |
| `:s/old/new/`    | Replace first occurrence in line    |

---

## Save / Exit Files

| Command      | Explanation                  |
|--------------|------------------------------|
| `:w`         | Save                         |
| `:w <file>`  | Save as different name       |
| `:q`         | Quit                         |
| `:q!`        | Quit without saving          |
| `:wq` / `ZZ` | Save & quit                  |
| `:x`         | Save & quit                  |

---

## Useful Extras

| Command             | Explanation            |
|---------------------|------------------------|
| `:set number`       | Show line numbers      |
| `:set nonumber`     | Hide line numbers      |
| `:set hlsearch`     | Highlight search hits  |
| `:set nohlsearch`   | Disable highlighting   |
| `:set tabstop=4`    | Tab width              |
| `:set shiftwidth=4` | Indentation            |
| `:set expandtab`    | Tabs to spaces         |
| `:!command`         | Execute shell command  |
| `:r file`           | Insert file            |

---

## Practical Tips

- **Better Working:** Use `vimtutor` for interactive training (`vimtutor` in terminal).
- **Undo/Redo:** `u` undo, `Ctrl-r` redo.
- **Multi-line Editing:** Visual mode (`V`) + movement + commands.
- **Quick Jump:** `/searchterm` + `n`/`N`.
- **External Commands:** `:!ls` or `:!python %` executes external commands.
- **Record Macros:** `q<register>` start, execute commands, `q` end, `@<register>` playback.

---

## Resources

- Official Vim Documentation: [https://www.vim.org/docs.php](https://www.vim.org/docs.php)
- Interactive Tutorials: `vimtutor` (Linux/macOS)
- Cheatsheet PDF: [Vim Cheat Sheet](https://vim.rtorr.com/)

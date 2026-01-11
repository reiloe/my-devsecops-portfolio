---
title: 📝 YAML
---

# YAML

**Brief:** YAML (YAML Ain't Markup Language) is a human-readable data serialization format often used for configuration files, deployment manifests (e.g., Kubernetes), CI/CD pipelines, and data transfer. This guide covers basics, advanced features, best practices, security aspects, and concrete examples from practical contexts like Kubernetes, Helm, and CI.

This guide serves as a reference for developers, DevOps engineers, and security engineers who want to use YAML safely and effectively in software projects.

---

## Table of Contents

1. [Introduction: What is YAML? When to use?](#1-introduction-what-is-yaml-when-to-use)
2. [Basic Syntax: Scalars, Sequences, Mapping](#2-basic-syntax-scalars-sequences-mapping)
3. [Indentation, Whitespaces and Flow vs Block Style](#3-indentation-whitespaces-and-flow-vs-block-style)
4. [Strings, Quotes, Escape Sequences](#4-strings-quotes-escape-sequences)
5. [Multiline Strings: Literal (`|`) vs Folded (`>`)](#5-mehrzeilige-strings-literal--vs-gefaltet-)
6. [Booleans, Null, Numbers, Dates](#6-booleans-null-numbers-dates)
7. [Anchors & Aliases, Merge Key](#7-anchors--aliases-merge-key)
8. [Tags & Types, Explicit Type Declaration](#8-tags--types-explicit-type-declaration)
9. [Documents & Streams (Multiple Docs in One File)](#9-documents--streams-multiple-docs-in-one-file)
10. [Comments, Directives and YAML Version](#10-comments-directives-and-yaml-version)
11. [Advanced: Tags, Custom Types, Merge, & Complex Keys](#11-advanced-merge-complex-keys--multi-line-keys)
12. [YAML in the Ecosystem: Parsers/Libs (Python, JS, Go, Java, Ruby)](#12-yaml-in-the-ecosystem-parserslibs)
13. [Tools: Linters, Formatters, Validators (yamllint, kubeval, kube-score, spectral)](#13-tools-linters-formatters-validators)
14. [YAML for Kubernetes & Helm (Practical Notes)](#14-yaml-for-kubernetes--helm-practical-notes)
15. [Security: Deserialization Risks & Safe Load Functions](#15-security-deserialization-risks--safe-load-functions)
16. [Best Practices & Styleguide](#16-best-practices--styleguide)
17. [Troubleshooting: Common Errors & Debugging Techniques](#17-troubleshooting-common-errors--debugging-techniques)
18. [Examples: Configs, CI (GitHub Actions), Helm Chart Values, Kubernetes Manifests](#18-examples)
19. [Quick Reference / Cheatsheet](#19-quickreference--cheatsheet)
20. [Further Links & Resources](#20-further-links--specification)

---

## 1. Introduction: What is YAML? When to use?

YAML is a data format that emphasizes readability. It is easier to write/read than JSON for complex configurations by omitting brackets and quotation marks. Used in:

- Configuration files (e.g. GitHub Actions, CircleCI, Ansible, Travis)
- Kubernetes manifests (Pods, Deployments, Services)
- Helm charts (`values.yaml`)
- CI/CD pipelines
- Data exchange, documentation

---

## 2. Basic Syntax: Scalars, Sequences, Mapping

### Scalars (Scalar Values)

```yaml
title: "My Application"
replicas: 3
debug: true
```

### Sequences (Lists) — Block Style

```yaml
servers:
  - host: web01.example.com
    port: 80
  - host: web02.example.com
    port: 80
```

### Mapping (Key: Value)

```yaml
database:
  host: db.example.com
  port: 5432
  credentials:
    user: "appuser"
    password: "geheim"
```

---

## 3. Indentation, Whitespaces and Flow vs Block Style

YAML uses **indentation** (typically 2 or 4 spaces; tabs are not allowed!). Consistency is important.

**Block Style** (recommended for readability):

```yaml
list:
  - one
  - two
```

**Flow Style** (similar to JSON, more compact):

```yaml
list: [one, two]
mapping: { a: 1, b: 2 }
```

---

## 4. Strings, Quotes, Escape Sequences

Strings can be unquoted in YAML as long as they don't contain special characters. For complex strings use `'single'` or `"double"` quotes.

- **Unquoted**
-

```yaml
greeting: Hello world
```

- **Single quotes**: protects everything (no escape sequences, except `''` to escape `'`)
-

```yaml
text: 'It''s a single-quoted string'
```

- **Double quotes**: supports escape sequences (`\n`, `\t`, `\"`, `\\`)

```yaml
text: "Line1
Line2"
```

---

## 5. Mehrzeilige Strings: Literal (`|`) vs Gefaltet (`>`)

**Literal (`|`)** bewahrt Zeilenumbrüche:

```yaml
description: |
  Zeile 1
  Zeile 2
  Zeile 3
```

Ergebnis: Zeilen bleiben so erhalten (mit ``).

**Gefaltet (`>`)** ersetzt einfache Zeilenumbrüche durch Leerzeichen (nützlich für lange Textabschnitte):

```yaml
summary: >
  Dies ist ein langer Text,
  der in YAML über mehrere Zeilen
  geschrieben ist, aber zu einer Flow‑Zeile
  zusammengefügt wird.
```

Beachte Suffixe `|+`, `|-`, `>+`, `>-` um das Verhalten bezüglich des abschließenden Newlines zu kontrollieren.

---

## 6. Booleans, Null, Numbers, Dates

YAML interprets certain unquoted values as special types:

- **Booleans**: `true`, `false`, `True`, `False`, `yes`, `no`, `on`, `off` (caution: some variants are implicit)
- **Null**: `null`, `~`, (empty)
- **Numbers**: `int` and `float` (no quotes, otherwise string)
- **Dates**: ISO-8601 formats (`2023-10-01T12:00:00Z`)

Recommendation: Use **lowercase** `true/false/null` to avoid misunderstandings.

---

## 7. Anchors & Aliases, Merge Key

**Anchor (`&`)** defines a value/block, **Alias (`*`)** references it later. Very useful for avoiding duplicates in configurations.

```yaml
defaults: &defaults
  timeout: 30
  retries: 3

service-a:
  <<: *defaults
  host: a.example.com

service-b:
  <<: *defaults
  host: b.example.com
```

`<<: *defaults` is a **merge key**: the keys from `defaults` are merged into the target mapping. Local keys override merged keys.

**Note:** Anchors copy values — complex aliases can lead to unexpected behavior (mutable structures).

---

## 8. Tags & Types, Explicit Type Declaration

YAML supports tags to explicitly specify the data type:

```yaml
value: !!str 12345    # explicitly as string
number: !!int "42"    # as integer (even if in quotes)
```

Custom tags (`!mytag`) can be used in special parsers, often in combination with custom deserializers.

---

## 9. Documents & Streams (Multiple Docs in One File)

A YAML file can contain multiple documents, separated by `---`:

```yaml
---
apiVersion: v1
kind: Config
---
apiVersion: v1
kind: Service
```

`...` optionally marks the end of a stream.

---

## 10. Comments, Directives and YAML Version

Comments begin with `#` and extend to the end of the line.

Directives (`%YAML 1.2`) are rarely needed but are used in special cases.

---

## 11. Advanced: Merge, Complex Keys & Multi-Line Keys

Complex keys are possible, e.g., a map as a key (rare in practice).

Merge key (`<<`) can merge multiple sources:

```yaml
base: &base {a: 1, b: 2}
extra: &extra {b: 3, c: 4}

combined:
  <<: [*base, *extra]   # b is overridden by extra
```

---

## 12. YAML in the Ecosystem: Parsers/Libs

- **Python**: `PyYAML`, `ruamel.yaml` (ruamel supports round-trip editing)
  - *Security*: `yaml.load()` in PyYAML \<5.1 is unsafe — use `safe_load`.
- **JavaScript/Node.js**: `js-yaml`
- **Go**: `gopkg.in/yaml.v3`
- **Java**: `SnakeYAML`
- **Ruby**: `yaml` (standard library)

Example Python safe loading:

```python
import yaml
with open("config.yaml") as f:
    data = yaml.safe_load(f)
```

---

## 13. Tools: Linters, Formatters, Validators

- `yamllint` — Linting (Style, Syntax)
- `prettier` — Formatter (JS ecosystem)
- `kubeval` — Validates Kubernetes manifests against API schema
- `kube-score` — Analysis for best practices in Kubernetes resources
- `spectral` — JSON/YAML linter and rules (OpenAPI, AsyncAPI)
- `yq` — jq-like YAML processor (Mike Farah's yq; Go)
- `ytt` (Carvel) — Template tool focused on Kubernetes

---

## 14. YAML for Kubernetes & Helm (Practical Notes)

- **Kubernetes** uses YAML extensively; small errors (indentation, tabs) lead to deployment failures.
- **Helm**: `values.yaml` is the main configuration point; templates generate Kubernetes YAML via Go templates.
- **Best Practice**: validate manifests with `kubectl apply --dry-run=server` and `kubeval`.
- **CRDs** often require specific types; watch out for `!!str` vs numeric.

**Common pitfall**: unquoted large numeric IDs (e.g., `02123`) may be parsed as number and lose leading zeros — quote if significant.

---

## 15. Security: Deserialization Risks & Safe Load Functions

Many security incidents arise from deserializing untrusted YAML (e.g., RCE via custom tags):

- **PyYAML `yaml.load()`** can execute constructors — **never** use `load` on untrusted input; use `safe_load` instead.
- **SnakeYAML** had similar issues if using `Yaml.load` with arbitrary types — use restricted constructors or safe APIs.
- **Rule:** Treat YAML as data. Avoid custom tags from untrusted sources. Validate schema and enforce allowed types.

Example secure load in Python:

```python
data = yaml.safe_load(stream)   # No arbitrary object construction
```

For round-trip editing in configs while preserving comments, use `ruamel.yaml` carefully.

---

## 16. Best Practices & Styleguide

- Use **2 spaces** for indentation (or consistently 4, but pick one).
- No tabs.
- Quote strings when they:
  - begin with `yes`, `no`, `on`, `off`, `true`, `false`, `null`
  - contain leading zeros or special chars (`:`, `#`, `{`, `}`, `,`, `&`, `*`, `?`, `|`, `>`, `!`, `%`, `@`, `` ` ``)
- Use anchors for recurring configurations, but not nested too deeply.
- Keep documents small and modular (especially for Kubernetes manifests).
- Validate files with `yamllint` and domain validators (kubeval, spectral).
- Avoid complex custom tags unless necessary.

---

## 17. Troubleshooting: Common Errors & Debugging Techniques

- **Indentation errors**: check for tabs; use `yamllint`.
- **Unrecognized characters**: ensure UTF-8 encoding.
- **Unexpected types**: inspect parsed types (`type(value)` in Python) to see how parser interpreted values.
- **Missing keys in Kubernetes**: run `kubectl apply --dry-run=client -f file.yaml` and `kubectl explain <kind>`.

---

## 18. Examples

### Simple config

```yaml
app:
  name: myapp
  host: localhost
  port: 8080
  features:
    - auth
    - metrics
```

### GitHub Actions workflow (example)

```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install deps
        run: npm ci
      - name: Test
        run: npm test
```

### Kubernetes Deployment (minimal)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: web
          image: myapp:1.0
          ports:
            - containerPort: 8080
```

### Helm `values.yaml` snippet

```yaml
replicaCount: 2
image:
  repository: myapp
  tag: "1.0.0"
service:
  type: ClusterIP
  port: 80
```

---

## 19. Quick‑Reference / Cheatsheet

- List: `- item`
- Map: `key: value`
- String multiline literal: `|`
- String folded: `>`
- Anchor: `&anchor`, alias: `*anchor`, merge: `<<: *anchor`
- Safe load (Python): `yaml.safe_load()`
- No tabs, consistent indentation
- Use `yq` for CLI manipulation; `yamllint` for linting

---

## 20. Further Links & Specification

- YAML 1.2 Spec: [https://yaml.org/spec/1.2/spec.html](https://yaml.org/spec/1.2/spec.html)
- PyYAML: [https://pyyaml.org/](https://pyyaml.org/)
- ruamel.yaml: [https://yaml.readthedocs.io/](https://yaml.readthedocs.io/)
- js-yaml: [https://github.com/nodeca/js-yaml](https://github.com/nodeca/js-yaml)
- yq (mikefarah): [https://github.com/mikefarah/yq](https://github.com/mikefarah/yq)
- kubeval: [https://www.kubeval.com/](https://www.kubeval.com/)
- spectral: [https://meta.stoplight.io/docs/spectral/](https://meta.stoplight.io/docs/spectral/)

---

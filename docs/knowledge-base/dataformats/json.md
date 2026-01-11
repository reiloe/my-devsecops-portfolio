---
title: 📄 JSON
---

# JSON

**Brief:** This guide explains JSON (JavaScript Object Notation) from the basics to advanced topics. The focus is combined: developer practice (parsing, tools, APIs, streaming) and security aspects (validation, injection, logging for security). The goal is a practical, actionable reference.

---

## Table of Contents (Overview)

1. [Introduction & Motivation](#1-introduction--motivation)
2. [JSON Basics: Syntax & Data Types](#2-json-basics-syntax--data-types)
3. [Structures: Objects, Arrays, Nesting](#3-strukturen-objekte-arrays-verschachtelung)
4. [Strings, Escapes, Unicode & Number Precision](#4-strings-escapes-unicode--zahlenpräzision)
5. [Files & Formats: .json, .ndjson, Streaming](#5-files--formats-json-ndjson-streaming)
6. [JSON in Practice: APIs, Configs, Logs](#6-json-in-practice-apis-configs-logs)
7. [Parsing & Serialization (JavaScript, Python, Go, Java, Rust)](#7-parsing--serialization-examples)
8. [JSON Schema: Concepts, Examples, Validators, Best Practices](#8-json-schema-concepts-examples-validators-best-practices)
9. [JSON Patch / JSON Merge Patch / JSON Pointer](#9-json-patch--json-merge-patch--json-pointer)
10. [Queries: jq, JSONPath, Tools](#10-queries-jq-jsonpath-tools)
11. [Streaming & Large Datasets: NDJSON, SAX-like Parsers](#11-streaming--large-datasets)
12. [Logging & SIEM: Structured Logs, ELK/EFK, Index Design](#12-logging--siem-structured-logs-elkefk-index-design)
13. [Security: Injection, XSS, Deserialization, CORS, CSP, Rate-Limiting](#13-sicherheit-injection-xss-deserialisierung-cors-csp-ratelimiting)
14. [API Design & Backwards Compatibility, Versioning](#14-api-design--backwards-compatibility-versioning)
15. [Tests, CI and Contract Testing (Pact, schema tests)](#15-tests-ci-and-contract-testing)
16. [Performance, Compression & Transport Optimization](#16-performance-compression--transport-optimization)
17. [Canonicalization, Signatures & JSON-LD (Linked Data)](#17-canonicalization-signatures--json-ld)
18. [Troubleshooting & Debugging Workflow](#18-troubleshooting--debugging-workflow)
19. [Best Practices & Styleguide (concrete)](#19-best-practices--concrete-styleguide)
20. [Cheatsheet & Quick-Reference](#20-cheatsheet--quick-reference)
21. [Further Resources](#21-further-resources)

---

## 1. Introduction & Motivation

JSON is the de-facto format for data transfer on the web. It is simple, text-based, human-readable and available natively or via library in almost every programming language. JSON is particularly suitable for:

- REST/HTTP APIs (request/response)
- Configuration files (when no complex anchors are needed)
- Log data (NDJSON) for analytics and SIEM
- Event streaming (e.g., Kafka, Kinesis)

**Why this guide?** Developers need clear guidance on proper JSON handling (parsing, schema, errors), security teams need instructions for secure validation and attack detection — this guide combines both.

---

## 2. JSON Basics: Syntax & Data Types

**Formal Rules** (summary):

- A JSON document is an object `{ ... }` or an array `[ ... ]`.
- Keys must be strings in **double** quotes.
- Values: `string`, `number`, `object`, `array`, `true`, `false`, `null`.
- No comments in standard JSON.
- Default encoding: **UTF-8**.

**Example:**

```json
{
  "user": {
    "id": 12345,
    "name": "Example",
    "active": true,
    "roles": ["user","admin"],
    "meta": null
  }
}
```

**Note on readability:** For configurations, teams often prefer YAML (comments, anchors). For APIs and logs, JSON is often the better choice.

---

## 3. Strukturen: Objekte, Arrays, Verschachtelung

- **Objekt**: `{ "k": v, ... }` — ungeordnete Map von Strings → Values.
- **Array**: `[ v1, v2, ... ]` — geordnete Liste. Elemente können heterogen sein, aber Konsistenz ist empfehlenswert.
- **Verschachtelung**: Werte können Objekte oder Arrays enthalten — Tiefe kann zu Komplexität führen.

**Design‑Tipp:** Normalisiere schreib‑intensive Daten; vermeide sehr tiefe Verschachtelung, die consumer schwer parsen.

---

## 4. Strings, Escapes, Unicode & Zahlenpräzision

**Strings:** müssen in doppelten Anführungszeichen. Steuerzeichen wie `"` und `\` müssen escaped werden: `\"`, `\\`. Zeilenumbruch `\n`, Tab `\t`.

**Unicode:** JSON‑Text ist UTF‑8. Unicode‑Escapes `\uXXXX` sind erlaubt, aber in modernen Systemen meist unnecessary.

**Zahlen & Präzision:** JSON verwendet keine expliziten Typannotationen für Ganzzahlen vs Floating. Viele Implementierungen nutzen IEEE‑754 double (z. B. JavaScript). **Große Ganzzahlen (> 2^53‑1)** verlieren in JavaScript Präzision — Übertrage solche IDs als String, wenn Client‑seitig wichtig.

---

## 5. Files & Formats: .json, .ndjson, Streaming

- **.json**: One document per file. Good for small/medium.
- **NDJSON / JSON Lines**: One line = one JSON object. Ideal for logs/streaming. Tools like `jq` and Elastic often accept NDJSON natively.
- **Streaming**: Use SAX-like parsers for large bodies (`ijson` in Python, `stream-json` in Node).

**NDJSON example:**

```text
{"ts":"2025-10-08T12:00:00Z","event":"start"}
{"ts":"2025-10-08T12:00:02Z","event":"click","user":123}
```

---

## 6. JSON in Practice: APIs, Configs, Logs

**APIs:** JSON is standard payload for REST. Best practices: consistent naming convention (camelCase), ISO-8601 date format, unique error objects (`code`, `message`, `details`).

**Configs:** OK for simple apps, for complex deployments rather YAML/Helm (templating).

**Logs:** Structured logs (JSON) simplify parsing in ELK/EFK, enable precise search and analysis. Use NDJSON for append-friendly logging.

---

## 7. Parsing & Serialization (Examples)

**JavaScript (Node/Browser):**

```javascript
const obj = JSON.parse(jsonString);
const json = JSON.stringify(obj); // compact
const pretty = JSON.stringify(obj, null, 2); // pretty print
```

Edge cases: `JSON.parse` throws on invalid JSON — catch it!

**Python:**

```python
import json
obj = json.loads(json_string)
s = json.dumps(obj, ensure_ascii=False, indent=2)
```

Large files: `ijson` for iterative parsing.

**Go:**

```go
import "encoding/json"
var v MyStruct
err := json.Unmarshal([]byte(jsonStr), &v)
b, _ := json.MarshalIndent(v,"","  ")
```

**Java (Jackson):**

```java
ObjectMapper m = new ObjectMapper();
MyType t = m.readValue(jsonString, MyType.class);
String json = m.writerWithDefaultPrettyPrinter().writeValueAsString(t);
```

**Rust (serde_json):**

```rust
let v: Value = serde_json::from_str(&json_str)?;
let s = serde_json::to_string_pretty(&v)?;
```

---

## 8. JSON Schema: Concepts, Examples, Validators, Best Practices

**Purpose:** Schema defines shape, types, required fields, format constraints. This allows servers and clients to check contracts.

**Simple schema (example):**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "User",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "email": { "type": "string", "format": "email" },
    "age": { "type": "integer", "minimum": 0 }
  },
  "required": ["id","name","email"],
  "additionalProperties": false
}
```

**Validators:** `ajv` (Node), `jsonschema` (Python), `everit` (Java), `gojsonschema` (Go).

**Best Practices:**

- Version schemas (v1, v2) and store in registry or repo.
- Validation as early as possible (gateway, API layer).
- `additionalProperties: false` prevents unexpected fields — helpful for strictness.
- Use `oneOf`, `anyOf`, `allOf` for polymorphic types with care.
- Document default values and nullable vs optional.

**Error handling:** On schema errors: 400 Bad Request with an error list (path, expected type).

---

## 9. JSON Patch / JSON Merge Patch / JSON Pointer

- **JSON Pointer (RFC 6901):** Path notation e.g., `/users/0/name` to access an element.
- **JSON Patch (RFC 6902):** List of operations (`add`, `remove`, `replace`, `move`, `copy`, `test`) — suitable for precise, atomic updates.
- **JSON Merge Patch (RFC 7386):** Simpler merge object, useful for partial updates.

**Patch example (replace):**

```json
[
  { "op": "replace", "path": "/name", "value": "New Name" }
]
```

**Security:** Patch operations should be authorized and validated – prevent unauthorized fields from being changed.

---

## 10. Queries: jq, JSONPath, Tools

**jq** is a very powerful CLI tool:

- Filter, map, reduce, select, grouping.
  Example: `jq '.users[] | select(.active) | .email' data.json`

**JSONPath:** XPath-like query language; implementations vary (Jayway, Goessner). Example: `$.store.book[?(@.price<10)].title`.

**Other tools:** `yq` (supports JSON/YAML), `gron` (makes JSON into grep-friendly lines).

---

## 11. Streaming & Large Datasets

For large JSON payloads (logs, exports), memory parsers are unsuitable.

**Solutions:**

- **NDJSON** for line-by-line processing.
- **SAX/streaming parsers** (`ijson` Python, `stream-json` Node) process events and keep memory low.
- **Chunked Transfer Encoding** for HTTP streaming.

**Tips:** Compress (gzip), set Content-Length/Transfer-Encoding, rate-limit when reading.

---

## 12. Logging & SIEM: Structured Logs, ELK/EFK, Index Design

**Advantage of structured logs:** consistent fields, simple queries, aggregations, alerting.

**Example log format (NDJSON):**

```text
{"ts":"2025-10-08T12:00:00Z","level":"info","service":"api","msg":"start","requestId":"abc"}
{"ts":"2025-10-08T12:00:03Z","level":"error","service":"api","msg":"db error","error":"timeout"}
```

**ELK/EFK Pipeline:** Logstash/Fluentd/FluentBit → Elasticsearch → Kibana/Grafana. Index design: `service-%Y.%m.%d` or ingested per environment. Mapping: explicit field typing (keyword vs text, date, long) improves search/aggregate performance.

**Security use case:** Alerting on fields like `error` or unusual `requestCount` increases, correlate with IDS logs.

---

## 13. Sicherheit: Injection, XSS, Deserialisierung, CORS, CSP, Rate‑Limiting

**JSON Injection:** Probleme entstehen meist beim unsicheren Einbetten von JSON in HTML oder beim ungeprüften Binden an Application‑Types.

- **Unsafe embedding in HTML:**
-

  ```html
  <script>var cfg = JSON.parse("{{ raw_json }}");</script>
  ```

  Wenn `raw_json` nicht escaped ist, kann ein Angreifer Script einschleusen → XSS. **Safe:** JSON als Text in `<script type="application/json">` legen oder serverseitig `JSON.stringify` und HTML‑escape anwenden.

- **Deserialisierungs‑Risiken:** JSON selbst baut keine Objekte mit Konstruktor‑Seiteneffekten wie unsichere YAML‑Loader. Dennoch: beim Binden an Klassen in manchen Frameworks prüfe, dass keine Konstruktoren/Setter Code ausführen.

- **API Authorization:** Validierung + Authz: Prüfe, dass der Nutzer die Rechte hat, an einem Feld zu arbeiten (z. B. `isAdmin`). Schema + Business‑Logic Checks.

- **CORS / CSP:** Setze `Content-Type: application/json; charset=utf-8`. Konfiguriere CORS streng (Whitelist). Richte CSP‑Header ein, damit Schadskripte blockiert werden, falls doch XSS auftritt.

- **Rate‑Limiting & Abuse:** Schütze Endpoints vor Brute‑Force und JSON‑Flooding. Nutze Throttling, CAPTCHA für „suspicious“ patterns.

- **Large Payload DoS:** Limitierende Middleware (max body size), stream parsing, timeouts.

- **Logging Sensible Data:** Maskiere PII/Secrets vor Persistenz (cookies, tokens).

---

## 14. API Design & Backwards Compatibility, Versioning

**Versioning:** Path versioning (`/v1/resource`) or header versioning. Never breaking changes without versioning. **Compatible changes:** additive (new optional fields) are compatible; removal/rename are breaking.

**Contract Testing:** Pact or consumer-driven tests secure client-server contracts.

**Error Handling Pattern:** standardize error objects:

```json
{ "error": { "code": "INVALID_INPUT", "message": "Name missing", "details":[...] } }
```

---

## 15. Tests, CI and Contract Testing

**Unit Tests:** Validation against schema e.g., with `ajv` (Node) or `jsonschema` (Python).

**Integration/Contract Tests:** Use Pact or consumer-driven tests. Automate in CI: linter (prettier), schema validation, sample contracts.

**Fuzzing:** JSON fuzzers generate edge values (very large strings, unexpected types) to test robustness.

---

## 16. Performance, Compression & Transport Optimization

- **Minify**: Remove whitespaces in production (minified JSON).
- **Compression**: gzip/deflate for HTTP (client/server sees).
- **Binary formats**: MessagePack/CBOR when bandwidth or CPU critical.
- **Batching**: Send arrays instead of many single requests.
- **Indexing**: For Elasticsearch: set `keyword` for aggregations, `text` for full-text.

---

## 17. Canonicalization, Signatures & JSON-LD

**Canonicalization:** For digital signatures (JWS), use standardized Canonical JSON (JCS) or JOSE libraries to ensure deterministic byte representation.

**JSON-LD:** For Linked Data, use of `@context`, `@id`. Relevant for semantics/knowledge graphs.

**Signing:** Use JOSE (JWS) or sign hashes over canonical JSON. Verify on receipt.

---

## 18. Troubleshooting & Debugging Workflow

- **Find syntax errors:** `jq . file.json` or `python -m json.tool file.json`
- **Schema errors:** use validator (ajv) and output path + expected type
- **Encoding issues:** Check file for BOM, set UTF-8
- **Performance bottlenecks:** Profiling, streaming instead of load into memory

---

## 19. Best Practices & Concrete Styleguide

- **Conventions:** Choose `camelCase` for JSON APIs (JavaScript/TypeScript) or `snake_case` if Python dominant — consistency beats preference.
- **Date format:** ISO-8601 UTC for timestamps `2025-10-08T12:34:56Z`.
- **IDs:** Strings for large IDs. Unique field `id` and `requestId` for tracing.
- **Null vs absent:** Define team-wide whether `null` is used or fields are omitted.
- **Schema:** Version and publish schemas. Use `additionalProperties` deliberately.
- **Logging:** Structured NDJSON, mask secrets, include trace/request id.
- **Errors:** Standardize error payloads (code, message, details).
- **Documentation:** Auto-generate API docs from schemas (OpenAPI + JSON Schema).

---

## 20. Cheatsheet & Quick-Reference

- Parse JS: `JSON.parse(s)`
- Stringify JS: `JSON.stringify(obj, null, 2)`
- Pretty print Python: `python -m json.tool file.json` or `json.dumps(obj, ensure_ascii=False, indent=2)`
- jq examples: `jq '.items[] | select(.active)' file.json`
- Validate ajv: `ajv validate -s schema.json -d data.json`
- NDJSON: one JSON object per line (append friendly)

---

## 21. Further Resources

- JSON Spec / RFCs: [https://www.json.org](https://www.json.org), ECMA-404
- JSON Schema: [https://json-schema.org/](https://json-schema.org/)
- jq: [https://stedolan.github.io/jq/](https://stedolan.github.io/jq/)
- ajv: [https://ajv.js.org/](https://ajv.js.org/)
- ijson (Python): [https://pypi.org/project/ijson/](https://pypi.org/project/ijson/)
- MessagePack / CBOR: more efficient binary formats

---

## Appendix: Concrete Examples

### 1) API Response Example (User List)

```json
{
  "meta": { "page": 1, "perPage": 20, "total": 124 },
  "data": [
    { "id": "u_1", "name": "Anna", "email": "anna@example.com" },
    { "id": "u_2", "name": "Ben", "email": "ben@example.com" }
  ]
}
```

### 2) JSON Schema Example (Complex)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Order",
  "type": "object",
  "properties": {
    "orderId": { "type": "string" },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "sku": { "type": "string" },
          "qty": { "type": "integer", "minimum": 1 }
        },
        "required": ["sku","qty"]
      }
    },
    "shipping": {
      "type": "object",
      "properties": {
        "address": { "type": "string" },
        "method": { "type": "string", "enum": ["standard","express"] }
      },
      "required": ["address"]
    }
  },
  "required": ["orderId","items"],
  "additionalProperties": false
}
```

### 3) NDJSON Logs Example

```text
{"ts":"2025-10-08T12:00:00Z","service":"api","level":"info","msg":"start","requestId":"r1"}
{"ts":"2025-10-08T12:00:01Z","service":"api","level":"error","msg":"db timeout","requestId":"r1","error":"timeout"}
```

---

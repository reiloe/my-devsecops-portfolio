---
title: 📈 Grafana
---

# Grafana

Grafana is an **open-source platform for monitoring and visualization** that visualizes data from various sources such as Prometheus, Elasticsearch, MySQL, PostgreSQL, and many others.

---

## Table of Contents

1. [Basics](#1-basics)
2. [Architecture Diagram](#2-architecture-diagram)
3. [Platform-Specific Installation](#3-platform-specific-installation)
    - [3.1 Linux Installation](#31-linux-installation-debianubuntu)
    - [3.2 MacOS Installation](#32-macos-installation)
    - [3.3 Windows Installation](#33-windows-installation)
    - [3.4 Docker Installation](#34-docker-installation)
    - [3.5 Kubernetes Installation](#35-kubernetes-installation)
4. [Dashboard Examples](#4-dashboard-examples)
5. [Dashboard Workflow](#5-dashboard-workflow)
6. [Practical Examples](#6-practical-examples)
7. [Best Practices](#7-best-practices)
8. [Conclusion](#8-conclusion)

---

## 1. Basics

- **Main Features:**
  - Create real-time dashboards
  - Connect and query data sources
  - Configure alerts
  - Panels for various visualization types

- **Supported Data Sources:**
  - Prometheus, Elasticsearch, Loki, MySQL, PostgreSQL, InfluxDB, Graphite, and many more

- **Visualization Types:**
  - Graph, Bar Gauge, Table, Heatmap, Pie Chart, Stat Panels

---

## 2. Architecture Diagram

```mermaid
flowchart LR
A[Data Source] --> B[Grafana Server]
B --> C[Dashboard & Visualizations]
C --> D[Admin/Analyst]
```

---

## 3. Platform-Specific Installation

### 3.1 Linux Installation (Debian/Ubuntu)

```bash
sudo apt-get install -y software-properties-common
sudo add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
sudo apt update
sudo apt install grafana
sudo systemctl enable grafana-server
sudo systemctl start grafana-server
sudo systemctl status grafana-server
```

### 3.2 MacOS Installation

```brew
brew update
brew install grafana
brew services start grafana
```

### 3.3 Windows Installation

1. [Download Grafana MSI](https://grafana.com/grafana/download)
2. Start installation and follow steps
3. Start: Grafana via Start menu or run `grafana-server.exe`
4. Web UI: `http://localhost:3000` (Default user: admin / admin)

---

### 3.4 Docker Installation

```bash
docker pull grafana/grafana:latest
docker run -d -p 3000:3000 --name=grafana grafana/grafana:latest
```

### Docker Compose Example

```yaml
version: '3.9'
services:
    grafana:
      image: grafana/grafana:latest
      ports:
        - "3000:3000"
      environment:
        - GF_SECURITY_ADMIN_USER=admin
        - GF_SECURITY_ADMIN_PASSWORD=admin
      volumes:
        - grafana-data:/var/lib/grafana
volumes:
  grafana-data:
```

### 3.5 Kubernetes Installation

```bash
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
helm install grafana grafana/grafana --set adminUser=admin --set adminPassword=admin --set service.type=LoadBalancer
```

---

## 4. Dashboard Examples

### a) Connect Data Sources

- Example: Prometheus URL: `http://prometheus:9090`

### b) Create Panels

1. **CPU Usage**
    - Graph Panel
    - Query: `node_cpu_seconds_total` (Prometheus)
2. **Memory Consumption**
    - Gauge or Stat Panel
3. **Network Traffic**
    - Graph Panel
4. **Logs from Loki**
    - Table Panel

---

## 5. Dashboard Workflow

```mermaid
sequenceDiagram
participant Admin
participant Grafana
participant DS as Data Source (Prometheus/Elasticsearch)

    DS->>Grafana: Provide data
    Admin->>Grafana: Open dashboard
    Grafana->>DS: Send query
    DS->>Grafana: Return results
    Grafana->>Admin: Display visualization
```

---

## 6. Practical Examples

### Export / Import Dashboards

```bash
# Export JSON
curl -X GET "http://admin:admin@localhost:3000/api/dashboards/uid/<DASHBOARD_UID>" -o dashboard.json

# Import JSON
curl -X POST "http://admin:admin@localhost:3000/api/dashboards/db" \
-H "Content-Type: application/json" \
-d @dashboard.json
```

---

## 7. Best Practices

1. **Structure dashboards:** Per service or use case
2. **Optimize data sources:** Design queries efficiently
3. **Alerting:** Configure notifications via email, Slack, or webhook
4. **Versioning:** Save dashboards as JSON
5. **Roles and permissions:** Distinguish between Admin/User/Viewer
6. **Backup:** Regularly backup volumes or export dashboards

---

## 8. Conclusion

- Grafana offers **flexible visualization** of any metrics and logs
- Platform-independent: Installations for Linux, Mac, Windows, Docker, Kubernetes
- Ideal for monitoring, performance analysis, and alerting

---

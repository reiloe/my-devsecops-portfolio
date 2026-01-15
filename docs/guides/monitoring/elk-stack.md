---
title: 📉 ELK Stack
---

# 🧩 ELK Stack

## Table of Contents

1. [🔹 Basic Concept](#-basic-concept)
2. [🔹 Architecture & Components](#-architecture--components)
3. [🔹 Installation - Bare Metal](#-installation---bare-metal)
4. [🔹 Installation - Docker / Container](#-installation---docker--container)
5. [🔹 Best Practices](#-best-practices)
6. [🔹 Documented Example - Logstash Pipeline](#-documented-example---logstash-pipeline)
7. [🔹 Documented Example - Kibana Dashboard](#-documented-example---kibana-dashboard)
8. [🔹 Conclusion](#-conclusion)

---

## 🔹 Basic Concept  

The **ELK Stack** consists of **Elasticsearch, Logstash, and Kibana**. Often **Beats** (Filebeat, Metricbeat, etc.) is also used, so it's also called the **Elastic Stack**.  
The goal of the ELK Stack is the **centralized collection, analysis, and visualization of logs and metrics**.

- **Elasticsearch** -> Database & search engine  
- **Logstash** -> Log processing & transformation  
- **Kibana** -> Visualization & dashboarding  
- **Beats** -> Lightweight agents for log/metric forwarding  

The stack is suitable for **security monitoring, application logs, metrics monitoring**, and **DevOps analytics**.

---

## 🔹 Architecture & Components

| Component     | Function                                                             |
|---------------|----------------------------------------------------------------------|
| Elasticsearch | Storage of logs/metrics, full-text search, indexing, REST API        |
| Logstash      | Data ingestion, filtering/parsing, forwarding to Elasticsearch       |
| Kibana        | Dashboards, visualization, queries, alerts                           |
| Filebeat      | Lightweight agent for log files                                      |
| Metricbeat    | Collect system & container metrics                                   |
| Heartbeat     | Monitoring service availability                                      |
| Auditbeat     | Collect security/audit events                                        |

**Flow:**  

Logs -> Beats -> Logstash -> Elasticsearch -> Kibana -> Alerts/Visualization

---

## 🔹 Installation - Bare Metal

### 1. Elasticsearch

```bash
# Add repository (Debian/Ubuntu)
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
sudo apt-get install apt-transport-https
echo "deb https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list
sudo apt-get update
sudo apt-get install elasticsearch
```

- Start & enable:

```bash
sudo systemctl enable elasticsearch
sudo systemctl start elasticsearch
```

- Test:

```bash
curl -X GET "localhost:9200/"
```

---

### 2. Logstash

```bash
sudo apt-get install logstash
sudo systemctl enable logstash
sudo systemctl start logstash
```

**Configuration example** (`/etc/logstash/conf.d/01-syslog.conf`):

```conf
input {
  beats {
    port => 5044
  }
}

filter {
  grok {
    match => { "message" => "%{SYSLOGLINE}" }
  }
}

output {
  elasticsearch {
    hosts => ["localhost:9200"]
    index => "syslog-%{+YYYY.MM.dd}"
  }
}
```

- `input` -> Data source  
- `filter` -> Parsing / transformation  
- `output` -> Destination (Elasticsearch)  

---

### 3. Kibana

```bash
sudo apt-get install kibana
sudo systemctl enable kibana
sudo systemctl start kibana
```

- Default port: 5601  
- Access: `http://<host>:5601`  

---

### 4. Filebeat (as example agent)

```bash
sudo apt-get install filebeat
sudo filebeat modules enable system
sudo systemctl enable filebeat
sudo systemctl start filebeat
```

- Configured to send logs to Logstash or directly to Elasticsearch.  

**Example Filebeat output to Logstash** (`/etc/filebeat/filebeat.yml`):

```yaml
output.logstash:
  hosts: ["localhost:5044"]
```

---

## 🔹 Installation - Docker / Container

### Docker Compose example for ELK

```yaml
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.10.2
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - ES_JAVA_OPTS=-Xms1g -Xmx1g
    ulimits:
      memlock:
        soft: -1
        hard: -1
    ports:
      - "9200:9200"

  logstash:
    image: docker.elastic.co/logstash/logstash:8.10.2
    container_name: logstash
    volumes:
      - ./logstash/config:/usr/share/logstash/config
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    ports:
      - "5044:5044"
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.10.2
    container_name: kibana
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
```

- Logs / pipelines can be mounted via volumes  
- Container starts Elasticsearch -> Logstash -> Kibana  

---

## 🔹 Best Practices

1. **Resource Planning**  
   - Elasticsearch requires RAM: at least 2-4GB for small environments  
   - Adjust heap size: `ES_JAVA_OPTS=-Xms2g -Xmx2g`  

2. **Security**  
   - Enable HTTPS / TLS  
   - Users / roles for Kibana & Beats  
   - Firewalls: secure ports 9200, 5044, 5601  

3. **Index Management**  
   - Use index lifecycle policies  
   - Rotate / archive old logs  

4. **Scaling**  
   - Elasticsearch cluster for large data volumes  
   - Logstash can be scaled horizontally  
   - Kibana can have multiple nodes for redundancy  

5. **Parsing & Normalization**  
   - Use Grok / Mutate filters to make logs consistent  
   - Prefer Beats for structured logs  

6. **Monitoring & Alerts**  
   - Deploy Metricbeat + Heartbeat  
   - Alerts via Kibana Watcher or ElastAlert  

---

## 🔹 Documented Example - Logstash Pipeline

**Pipeline:** `/etc/logstash/pipeline/syslog.conf`

```conf
input {
  beats { port => 5044 }
}

filter {
  if "docker" in [source] {
    grok {
      match => { "message" => "%{DOCKERLOG}" }
    }
  } else {
    grok { match => { "message" => "%{SYSLOGLINE}" } }
  }
  date { match => ["timestamp", "ISO8601"] }
}

output {
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
    index => "logs-%{+YYYY.MM.dd}"
  }
}
```

- Automatic assignment based on source  
- Timestamp correctly set  
- Indices per day  

---

## 🔹 Documented Example - Kibana Dashboard

1. Index pattern: `logs-*`  
2. Visualization:  
   - **Pie Chart**: Log level (INFO/WARN/ERROR)  
   - **Line Chart**: Logs per minute  
   - **Data Table**: Top hosts / containers  
3. Alerts:  
   - Rule: `count > 100 ERROR logs in 5m` -> Email / Slack  

---

## 🔹 Conclusion

The **ELK Stack** is the central solution for **log management, monitoring, and security analytics**:

- Flexible data collection via Beats / Logstash  
- Powerful search & analysis with Elasticsearch  
- Intuitive dashboards & alerts via Kibana  
- Suitable for bare-metal and container environments  
- Best practices: security, scaling, index management, monitoring  

Combination with tools like **Trivy, Falco, Docker Bench** enables **complete container security monitoring**.

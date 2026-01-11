---
title: 🛡️ Wazuh
---

# 🧩 Wazuh

## Table of Contents

1. [🔹 Basic Concept](#-basic-concept)
2. [🔹 Architecture & Components](#-architecture--components)
3. [🔹 Installation - Bare Metal](#-installation---bare-metal)
4. [🔹 Installation - Docker / Container](#-installation---docker--container)
5. [🔹 Configuration](#-configuration)
6. [🔹 Examples](#-examples)
7. [🔹 Best Practices](#-best-practices)
8. [🔹 Conclusion](#-conclusion)

---

## 🔹 Basic Concept

**Wazuh** is an **open-source security monitoring platform** that provides features such as **Host Intrusion Detection (HIDS), log management, File Integrity Monitoring (FIM), vulnerability detection**, and **compliance audits**.  
Wazuh is based on **OSSEC** and significantly extends its functionality. It is ideal for **security monitoring, SIEM integration, and DevSecOps environments**.

**Main Goals of Wazuh:**

- Real-time security monitoring  
- Proactive detection of threats and anomalies  
- Centralized log collection and analysis  
- Compliance audits according to standards like **CIS, PCI-DSS, GDPR, HIPAA**  

---

## 🔹 Architecture & Components

| Component                                 | Function                                                                          |
|-------------------------------------------|-----------------------------------------------------------------------------------|
| **Wazuh Agent**                           | Runs on monitored hosts, collects logs, events, FIM data, system metrics          |
| **Wazuh Manager**                         | Centralized analysis of agent data, alerts, policy management                     |
| **Elastic Stack (Elasticsearch, Kibana)** | Storage, visualization, and reporting of events                                   |
| **Wazuh API**                             | REST API for interaction with the manager, data retrieval, management             |
| **Wazuh Rules & Decoders**                | Rules for event detection, parsing of log data                                    |

**Flow:**  

Agents -> Manager -> Elasticsearch -> Kibana -> Alerts/Dashboards

---

## 🔹 Installation - Bare Metal

### 1. Add Wazuh Repository

```bash
curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | sudo apt-key add -
echo "deb https://packages.wazuh.com/4.x/apt stable main" | sudo tee /etc/apt/sources.list.d/wazuh.list
sudo apt-get update
```

### 2. Install Wazuh Manager

```bash
sudo apt-get install wazuh-manager
sudo systemctl enable wazuh-manager
sudo systemctl start wazuh-manager
```

### 3. Install Wazuh Agent

```bash
sudo apt-get install wazuh-agent
sudo systemctl enable wazuh-agent
sudo systemctl start wazuh-agent
```

### 4. Connect Agent to Manager

- Configuration on agent: `/var/ossec/etc/ossec.conf`

```xml
<ossec_config>
  <client>
    <server-ip>MANAGER_IP</server-ip>
  </client>
</ossec_config>
```

- Restart agent:  

```bash
sudo systemctl restart wazuh-agent
```

---

## 🔹 Installation - Docker / Container

### Docker Compose Example

```yaml
version: '3.8'
services:
  wazuh-manager:
    image: wazuh/wazuh:4.5.0
    container_name: wazuh-manager
    ports:
      - "1514:1514/udp"
      - "1515:1515"
      - "55000:55000"
    volumes:
      - wazuh-data:/var/ossec/data

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

  kibana:
    image: docker.elastic.co/kibana/kibana:8.10.2
    container_name: kibana
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

volumes:
  wazuh-data:
```

---

## 🔹 Configuration

### 1. Rules & Decoders

- **Rules** define which events are critical  
- **Decoders** parse different log formats  

Example: `/var/ossec/etc/rules/local_rules.xml`

```xml
<group name="docker">
  <rule id="100501" level="10">
    <decoded_as>json</decoded_as>
    <field name="tool">docker-bench-security</field>
    <field name="status">FAIL</field>
    <description>Docker Bench Critical Finding</description>
  </rule>
  <rule id="100502" level="10">
    <decoded_as>json</decoded_as>
    <field name="tool">trivy</field>
    <field name="Severity">HIGH</field>
    <description>Trivy High Severity CVE</description>
  </rule>
  <rule id="100503" level="10">
    <decoded_as>json</decoded_as>
    <field name="tool">falco</field>
    <field name="priority">CRITICAL</field>
    <description>Falco Critical Alert</description>
  </rule>
</group>
```

### 2. Log Collection via Filebeat / Syslog

- Wazuh agent can collect logs directly or forward them to Elasticsearch via Beats  
- Example: `ossec.conf` Agent -> Log path

```xml
<localfile>
  <log_format>json</log_format>
  <location>/var/log/trivy.log</location>
</localfile>
<localfile>
  <log_format>json</log_format>
  <location>/var/log/docker-bench.log</location>
</localfile>
<localfile>
  <log_format>json</log_format>
  <location>/var/log/falco.log</location>
</localfile>
```

---

## 🔹 Examples

### Agent Monitoring

- Check for critical Docker Bench findings:

```bash
sudo tail -f /var/ossec/logs/alerts/alerts.json | grep "docker-bench-security"
```

- Wazuh Kibana app: Dashboard shows:  
  - Hosts  
  - Alerts by severity  
  - Trends / historical data  

---

### Alerts & Notification

Example: Email alert when Wazuh rule is triggered

```xml
<rule id="100501" level="10">
  <if_sid>100501</if_sid>
  <description>Docker Bench Critical Finding</description>
  <email_to>admin@example.com</email_to>
</rule>
```

- Alternative: Integration with Slack, Teams, PagerDuty via Wazuh API or webhooks  

---

## 🔹 Best Practices

1. **Agent Coverage**  
   - Monitor all important hosts, container nodes, bastion hosts  

2. **Rule Management**  
   - Custom rules in `local_rules.xml`  
   - Update standard rules regularly  

3. **Performance**  
   - Elasticsearch cluster for large agent counts  
   - Optionally compress log forwarding  

4. **SIEM Integration**  
   - Wazuh Manager + Elasticsearch/Kibana -> central platform  
   - Filebeat can additionally collect agent logs  

5. **Security / Hardening**  
   - TLS between agent and manager  
   - Users/tokens for API access  
   - Firewall only allowed ports  

---

## 🔹 Conclusion

**Wazuh** is a central platform for:  

- **Host & container security monitoring**  
- **Log management & centralization**  
- **Intrusion detection & compliance audits**  

Combination with **ELK Stack, Trivy, Falco, and Docker Bench** enables **complete, automated container security monitoring** including alerting, reporting, and audit history.

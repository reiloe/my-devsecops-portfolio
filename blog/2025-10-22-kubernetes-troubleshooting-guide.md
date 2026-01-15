---
slug: kubernetes-troubleshooting-guide
title: "Kubernetes Troubleshooting Guide"
authors: [reiloe]
tags: [kubernetes, troubleshooting, debugging, operations]
---

Kubernetes troubleshooting can be challenging, especially when dealing with complex distributed systems.

This guide covers essential techniques and commands to diagnose and fix common issues quickly.

<!--truncate-->

## The Troubleshooting Mindset

Before diving into commands, remember these principles:

1. **Start broad, then narrow down**: Check cluster health → node status → pod status → logs
2. **Check recent changes**: What was deployed or modified recently?
3. **Use the right tools**: kubectl, logs, events, and metrics
4. **Document your findings**: Help your future self and your team

## Common Issues and Solutions

### 1. Pod Not Starting (CrashLoopBackOff)

**Symptoms:**

```bash
$ kubectl get pods
NAME                     READY   STATUS             RESTARTS   AGE
myapp-7d8f5c9b4d-xyz12   0/1     CrashLoopBackOff   5          3m
```

**Diagnosis:**

```bash
# Check pod description for events
kubectl describe pod myapp-7d8f5c9b4d-xyz12

# Check logs (current container)
kubectl logs myapp-7d8f5c9b4d-xyz12

# Check logs (previous crashed container)
kubectl logs myapp-7d8f5c9b4d-xyz12 --previous

# Check all containers in pod
kubectl logs myapp-7d8f5c9b4d-xyz12 --all-containers
```

**Common Causes:**

- Application crashes on startup
- Missing environment variables
- Failed health checks
- Insufficient permissions
- Missing dependencies

**Example Fix:**

```bash
# Check if ConfigMap/Secret exists
kubectl get configmap myapp-config
kubectl get secret myapp-secret

# Verify environment variables
kubectl get pod myapp-7d8f5c9b4d-xyz12 -o yaml | grep -A 10 env:
```

### 2. ImagePullBackOff

**Symptoms:**

```bash
$ kubectl get pods
NAME                     READY   STATUS             RESTARTS   AGE
myapp-7d8f5c9b4d-xyz12   0/1     ImagePullBackOff   0          2m
```

**Diagnosis:**

```bash
# Check events
kubectl describe pod myapp-7d8f5c9b4d-xyz12 | grep -A 5 Events

# Common error messages:
# - "pull access denied" → Authentication issue
# - "manifest unknown" → Image doesn't exist
# - "connection timeout" → Network/registry issue
```

**Solutions:**

```bash
# Verify image name and tag
kubectl get deployment myapp -o yaml | grep image:

# Check if image exists
docker pull myregistry/myapp:v1.0

# Verify image pull secrets
kubectl get secrets
kubectl describe secret regcred

# Create image pull secret if missing
kubectl create secret docker-registry regcred \
  --docker-server=myregistry.azurecr.io \
  --docker-username=myuser \
  --docker-password=mypassword \
  --docker-email=myemail@example.com

# Add to pod spec
kubectl patch serviceaccount default \
  -p '{"imagePullSecrets": [{"name": "regcred"}]}'
```

### 3. Pending Pods (Not Scheduled)

**Symptoms:**

```bash
$ kubectl get pods
NAME                     READY   STATUS    RESTARTS   AGE
myapp-7d8f5c9b4d-xyz12   0/1     Pending   0          5m
```

**Diagnosis:**

```bash
# Check scheduling events
kubectl describe pod myapp-7d8f5c9b4d-xyz12

# Check node resources
kubectl top nodes
kubectl describe nodes

# Check for taints and tolerations
kubectl get nodes -o custom-columns=NAME:.metadata.name,TAINTS:.spec.taints
```

**Common Causes:**

- Insufficient CPU/Memory
- No nodes match node selectors
- Node taints without tolerations
- PersistentVolume not available

**Solutions:**

```bash
# Scale down other deployments
kubectl scale deployment other-app --replicas=1

# Remove node selector if too restrictive
kubectl patch deployment myapp \
  -p '{"spec":{"template":{"spec":{"nodeSelector":null}}}}'

# Add toleration for tainted nodes
kubectl patch deployment myapp --type=json -p='[{
  "op": "add",
  "path": "/spec/template/spec/tolerations",
  "value": [{
    "key": "key1",
    "operator": "Equal",
    "value": "value1",
    "effect": "NoSchedule"
  }]
}]'
```

### 4. Service Not Accessible

**Symptoms:**

- Can't reach application via Service
- Connection timeouts
- DNS resolution fails

**Diagnosis:**

```bash
# Check service endpoints
kubectl get svc myapp-service
kubectl get endpoints myapp-service

# If endpoints are empty, pods aren't matching selector
kubectl get pods --selector=app=myapp

# Test DNS resolution
kubectl run -it --rm debug --image=busybox --restart=Never -- nslookup myapp-service

# Test connectivity from another pod
kubectl run -it --rm debug --image=nicolaka/netshoot --restart=Never -- bash
curl http://myapp-service:8080
```

**Solutions:**

```bash
# Verify service selector matches pod labels
kubectl get service myapp-service -o yaml
kubectl get pods --show-labels

# Check if pods are ready
kubectl get pods -l app=myapp

# Port-forward for direct testing
kubectl port-forward svc/myapp-service 8080:80
```

### 5. High Resource Usage

**Diagnosis:**

```bash
# Check resource usage
kubectl top nodes
kubectl top pods
kubectl top pods --all-namespaces --sort-by=memory
kubectl top pods --all-namespaces --sort-by=cpu

# Check resource limits
kubectl describe pod myapp-7d8f5c9b4d-xyz12 | grep -A 5 "Limits\|Requests"

# Check for OOMKilled pods
kubectl get pods --all-namespaces | grep OOMKilled
```

**Solutions:**

```bash
# Add/adjust resource limits
kubectl set resources deployment myapp \
  --limits=cpu=500m,memory=512Mi \
  --requests=cpu=250m,memory=256Mi

# Horizontal Pod Autoscaling
kubectl autoscale deployment myapp --min=2 --max=10 --cpu-percent=70
```

## Essential Troubleshooting Commands

### Quick Status Check

```bash
# Cluster overview
kubectl cluster-info
kubectl get componentstatuses

# Node health
kubectl get nodes
kubectl describe node <node-name>

# All resources
kubectl get all --all-namespaces

# Events (recent issues)
kubectl get events --sort-by='.lastTimestamp' --all-namespaces
kubectl get events --field-selector type=Warning --all-namespaces
```

### Deep Dive Commands

```bash
# Execute commands in pod
kubectl exec -it myapp-7d8f5c9b4d-xyz12 -- /bin/bash
kubectl exec -it myapp-7d8f5c9b4d-xyz12 -- ps aux
kubectl exec -it myapp-7d8f5c9b4d-xyz12 -- env

# Copy files from/to pod
kubectl cp myapp-7d8f5c9b4d-xyz12:/app/logs/error.log ./local-error.log
kubectl cp ./config.yaml myapp-7d8f5c9b4d-xyz12:/app/config.yaml

# Debug with ephemeral containers (K8s 1.23+)
kubectl debug myapp-7d8f5c9b4d-xyz12 -it --image=busybox --target=myapp

# Check API server logs (for managed clusters)
kubectl logs -n kube-system -l component=kube-apiserver
```

### Network Debugging

```bash
# Deploy debug pod
kubectl run debug --image=nicolaka/netshoot -it --rm -- bash

# Inside debug pod:
nslookup kubernetes.default
curl -v http://myapp-service:8080
traceroute myapp-service
netstat -tunlp
```

## Troubleshooting Workflow

1. **Identify the problem scope**
   - Single pod? Multiple pods? Entire deployment?
   - Specific namespace or cluster-wide?

2. **Gather information**

   ```bash
   kubectl get pods -o wide
   kubectl describe pod <pod-name>
   kubectl logs <pod-name>
   kubectl get events --sort-by='.lastTimestamp'
   ```

3. **Analyze and hypothesize**
   - What changed recently?
   - Are there patterns in errors?
   - Is it infrastructure or application?

4. **Test and validate**
   - Make one change at a time
   - Document what you try
   - Roll back if it doesn't help

5. **Monitor and verify**
   - Check if issue is resolved
   - Monitor for recurrence
   - Update documentation

## Pro Tips

- **Use aliases**: `alias k=kubectl`, `alias kgp='kubectl get pods'`
- **Context switching**: `kubectl config use-context production`
- **JSON/YAML output**: `kubectl get pod myapp -o yaml` for full details
- **Watch mode**: `kubectl get pods --watch` for real-time updates
- **Stern for logs**: `stern myapp` for multi-pod log tailing
- **K9s**: Terminal UI for easier navigation

## Prevention is Better Than Cure

- Implement proper health checks (liveness/readiness probes)
- Set resource requests and limits
- Use Pod Disruption Budgets
- Monitor with Prometheus/Grafana
- Set up alerts for critical issues
- Regular cluster audits

## Conclusion

Effective Kubernetes troubleshooting comes with practice. Build your mental model of how components interact, use these commands as your toolkit, and document your learnings.

Remember: **Every issue is a learning opportunity!**

---

*Need quick command references? Check our [Kubernetes Commands Cheat Sheet](/docs/knowledge-base/cheat-sheets/kubernetes-commands).*

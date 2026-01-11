---
slug: kubernetes-networking-explained
title: "Kubernetes Networking Demystified: A Practical Guide"
authors: [reiloe]
tags: [kubernetes, networking, infrastructure, containers]
---

Kubernetes networking can seem complex at first, but understanding the fundamentals is crucial for building reliable applications. Let's break down how networking works in Kubernetes with practical examples.

<!--truncate-->

## The Four Pillars of Kubernetes Networking

Kubernetes networking is built on four key principles:

1. **Pod-to-Pod communication** without NAT
2. **Node-to-Pod communication** without NAT
3. **Pod IP addresses** are consistent (from pod's perspective)
4. **Container-to-Container** within a pod via localhost

## Understanding the Network Model

### 1. Container-to-Container (within a Pod)

Containers in the same pod share the same network namespace:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: multi-container-pod
spec:
  containers:
  - name: nginx
    image: nginx
    ports:
    - containerPort: 80
  - name: sidecar
    image: busybox
    command: ['sh', '-c', 'while true; do wget -O- localhost:80; sleep 5; done']
```

**Key Point**: The sidecar can reach nginx via `localhost:80` because they share the network namespace.

### 2. Pod-to-Pod Communication

Every pod gets its own IP address. Pods can communicate directly:

```bash
# Pod A (10.244.1.5)
$ kubectl exec pod-a -- curl http://10.244.2.8:8080

# Pod B (10.244.2.8) receives the request
```

**How it works:**

- Each node runs a CNI plugin (Calico, Flannel, Cilium, etc.)
- CNI creates virtual network interfaces
- Routes traffic between pods across nodes
- No NAT required!

### 3. Pod-to-Service Communication

Services provide stable IPs and DNS names for pod groups:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: ClusterIP
```

**Service Types:**

#### ClusterIP (Default)

- Internal cluster access only
- Stable internal IP
- Use for: Database, internal APIs

```bash
# Access from within cluster
curl http://backend-service:80
curl http://backend-service.default.svc.cluster.local:80
```

#### NodePort

- Exposes service on each node's IP
- Port range: 30000-32767
- Use for: Development, simple external access

```yaml
spec:
  type: NodePort
  ports:
  - port: 80
    targetPort: 8080
    nodePort: 30080
```

```bash
# Access from outside cluster
curl http://<node-ip>:30080
```

#### LoadBalancer

- Cloud provider provisions external load balancer
- Use for: Production external services

```yaml
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 8080
```

#### ExternalName

- Maps service to external DNS name
- Use for: External databases, legacy systems

```yaml
apiVersion: v1
kind: Service
metadata:
  name: external-db
spec:
  type: ExternalName
  externalName: database.example.com
```

## DNS in Kubernetes

Kubernetes has built-in DNS (CoreDNS). Every service gets DNS records:

### Service DNS Format

```
<service-name>.<namespace>.svc.cluster.local
```

**Examples:**

```bash
# Same namespace
curl http://backend-service

# Different namespace
curl http://backend-service.production

# Fully qualified
curl http://backend-service.production.svc.cluster.local
```

### DNS for Pods (Headless Services)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: database
spec:
  clusterIP: None  # Headless service
  selector:
    app: postgres
  ports:
  - port: 5432
```

Access individual pod IPs:

```bash
# DNS records for each pod
database-0.database.default.svc.cluster.local
database-1.database.default.svc.cluster.local
database-2.database.default.svc.cluster.local
```

## Ingress: HTTP/HTTPS Routing

Ingress provides HTTP(S) routing to services:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: app.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 8080
  tls:
  - hosts:
    - app.example.com
    secretName: tls-secret
```

**Popular Ingress Controllers:**

- NGINX Ingress Controller
- Traefik
- HAProxy
- AWS ALB Ingress Controller
- GKE Ingress

## Network Policies

Control traffic between pods:

### Default Deny All Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress
```

### Allow Specific Traffic

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-backend
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
```

### Allow Egress to External API

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-external-api
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Egress
  egress:
  - to:
    - podSelector: {}  # Same namespace
  - to:
    - namespaceSelector:
        matchLabels:
          name: kube-system
  - to:  # External API
    ports:
    - protocol: TCP
      port: 443
```

## CNI Plugins Comparison

### Calico

- **Pros**: High performance, network policies, BGP routing
- **Best for**: Large clusters, security-focused
- **Use case**: Enterprise production

### Flannel

- **Pros**: Simple, easy setup, lightweight
- **Best for**: Development, small clusters
- **Use case**: Learning, testing

### Cilium

- **Pros**: eBPF-based, advanced features, observability
- **Best for**: Modern clusters, service mesh
- **Use case**: High-performance production

### Weave Net

- **Pros**: Automatic, easy encryption
- **Best for**: Quick setup, encrypted networking
- **Use case**: Multi-cloud deployments

## Practical Networking Examples

### Multi-Tier Application

```yaml
# Frontend Service (LoadBalancer)
apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  type: LoadBalancer
  selector:
    tier: frontend
  ports:
  - port: 80
    targetPort: 3000
---
# Backend Service (ClusterIP)
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  type: ClusterIP
  selector:
    tier: backend
  ports:
  - port: 8080
    targetPort: 8080
---
# Database Service (Headless)
apiVersion: v1
kind: Service
metadata:
  name: database
spec:
  clusterIP: None
  selector:
    tier: database
  ports:
  - port: 5432
```

### Network Policy Strategy

```yaml
# 1. Deny all traffic by default
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
---
# 2. Allow frontend -> backend
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: frontend-to-backend
spec:
  podSelector:
    matchLabels:
      tier: backend
  ingress:
  - from:
    - podSelector:
        matchLabels:
          tier: frontend
---
# 3. Allow backend -> database
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-to-database
spec:
  podSelector:
    matchLabels:
      tier: database
  ingress:
  - from:
    - podSelector:
        matchLabels:
          tier: backend
```

## Debugging Network Issues

### Test Connectivity

```bash
# Create debug pod
kubectl run test-pod --image=nicolaka/netshoot -it --rm -- bash

# Inside debug pod
# Test DNS
nslookup backend-service
nslookup backend-service.production.svc.cluster.local

# Test connectivity
curl -v http://backend-service:8080
ping 10.244.1.5

# Check routes
ip route
traceroute backend-service
```

### Check Service Endpoints

```bash
# Verify service has endpoints
kubectl get endpoints backend-service

# If empty, check pod labels
kubectl get pods --show-labels
kubectl get service backend-service -o yaml
```

### Verify Network Policy

```bash
# List network policies
kubectl get networkpolicies

# Describe policy
kubectl describe networkpolicy allow-frontend-to-backend

# Test if traffic is blocked
kubectl run test-curl --image=curlimages/curl -it --rm -- \
  curl http://backend-service:8080
```

## Best Practices

1. **Use Network Policies**: Default deny, explicit allow
2. **Choose the right Service type**: ClusterIP for internal, LoadBalancer for external
3. **Implement Ingress**: For HTTP(S) routing and TLS termination
4. **Monitor network traffic**: Use tools like Cilium Hubble or Calico Enterprise
5. **Test network policies**: Before deploying to production
6. **Use DNS names**: Not IP addresses for service discovery
7. **Secure inter-service communication**: Consider service mesh for mTLS

## Conclusion

Kubernetes networking is powerful once you understand the fundamentals. Start simple with Services and DNS, then add Ingress and Network Policies as needed.

The key is to think in terms of:

- **Services** for stable endpoints
- **DNS** for discovery
- **Network Policies** for security
- **Ingress** for external access

Master these concepts, and you'll be confident deploying any application architecture on Kubernetes!

---

*Looking for quick networking commands? Check out our [Kubernetes Commands Cheat Sheet](/docs/knowledge-base/cheat-sheets/kubernetes-commands).*

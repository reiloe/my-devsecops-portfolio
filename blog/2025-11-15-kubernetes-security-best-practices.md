---
slug: kubernetes-security-best-practices
title: Kubernetes Security Guide
authors: [reiloe]
tags: [kubernetes, security, devsecops, container-security]
---

Securing a Kubernetes cluster is critical for protecting your workloads and data. In this guide, we'll explore essential security best practices that every DevSecOps engineer should implement.

<!--truncate-->

## Why Kubernetes Security Matters

Kubernetes is a powerful orchestration platform, but its complexity introduces multiple attack vectors. From misconfigured RBAC to vulnerable container images, security must be built into every layer.

## 1. Implement Role-Based Access Control (RBAC)

RBAC is your first line of defense for controlling who can access what in your cluster.

### Key Principles

```yaml
# Create a read-only role for developers
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: development
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list", "watch"]
```

**Best Practices:**

- Use the principle of least privilege
- Create namespace-specific roles
- Avoid using `cluster-admin` role unnecessarily
- Regularly audit RBAC permissions

## 2. Network Policies

Control traffic between pods using Network Policies:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-ingress
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress
```

**Implementation Tips:**

- Start with deny-all policies
- Explicitly allow required traffic
- Segment namespaces with network policies
- Use labels for fine-grained control

## 3. Pod Security Standards

Enable Pod Security Standards to prevent dangerous configurations:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

**Security Contexts:**

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  capabilities:
    drop:
      - ALL
```

## 4. Secrets Management

Never store secrets in plain text or in your Git repository.

```bash
# Use Kubernetes secrets
kubectl create secret generic db-credentials \
  --from-literal=username=admin \
  --from-literal=password=secure-password

# Better: Use external secret managers
# - HashiCorp Vault
# - AWS Secrets Manager
# - Azure Key Vault
```

**Best Practices:**

- Enable encryption at rest for etcd
- Use external secret managers
- Rotate secrets regularly
- Limit secret access via RBAC

## 5. Image Security

Scan and verify container images before deployment:

```bash
# Scan images for vulnerabilities
trivy image nginx:latest

# Use only trusted registries
# Implement image signing with Cosign
cosign sign --key cosign.key myregistry/myimage:v1.0
```

**Image Policy:**

- Use minimal base images (Alpine, Distroless)
- Scan images in CI/CD pipeline
- Implement image admission controllers
- Keep images updated

## 6. Audit Logging

Enable and monitor audit logs:

```yaml
# Enable audit logging in API server
--audit-log-path=/var/log/kubernetes/audit.log
--audit-log-maxage=30
--audit-log-maxbackup=10
--audit-log-maxsize=100
--audit-policy-file=/etc/kubernetes/audit-policy.yaml
```

**What to Monitor:**

- Failed authentication attempts
- Privilege escalation
- Secret access
- Resource modifications

## 7. Resource Limits and Quotas

Prevent resource exhaustion attacks:

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
  namespace: development
spec:
  hard:
    requests.cpu: "10"
    requests.memory: 20Gi
    limits.cpu: "20"
    limits.memory: 40Gi
```

## 8. Secure the Control Plane

- Use private clusters when possible
- Enable API server authentication
- Restrict API server access with firewall rules
- Keep Kubernetes updated
- Use managed Kubernetes services (EKS, AKS, GKE)

## Security Checklist

- [ ] RBAC configured with least privilege
- [ ] Network policies implemented
- [ ] Pod Security Standards enabled
- [ ] Secrets encrypted at rest
- [ ] Image scanning in CI/CD
- [ ] Audit logging enabled
- [ ] Resource quotas defined
- [ ] Control plane secured
- [ ] Regular security audits
- [ ] Incident response plan

## Tools for Kubernetes Security

- **Trivy**: Vulnerability scanner
- **Falco**: Runtime security monitoring
- **OPA/Gatekeeper**: Policy enforcement
- **Kyverno**: Kubernetes-native policy management
- **Kubescape**: Security compliance scanning

## Conclusion

Kubernetes security is not a one-time setup but an ongoing process. Implement these best practices, regularly audit your clusters, and stay updated with the latest security recommendations.

Remember: **Security is everyone's responsibility** in a DevSecOps culture.

---

*Check out our [Kubernetes Commands Cheat Sheet](/docs/knowledge-base/cheat-sheets/kubernetes-commands) for quick reference!*

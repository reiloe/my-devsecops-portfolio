---
title: ⚓ Kubernetes Commands
sidebar_label: Kubernetes
sidebar_position: 3
tags: [kubernetes, k8s, kubectl, container-orchestration, cheat-sheet]
---

# ⚓ Kubernetes Commands Cheat Sheet

## kubectl Basics

```bash
# Cluster info
kubectl version                    # Client and server version
kubectl cluster-info               # Cluster information
kubectl get nodes                  # List nodes
kubectl get namespaces             # List namespaces

# Context and config
kubectl config view                # View config
kubectl config get-contexts        # List contexts
kubectl config current-context     # Current context
kubectl config use-context NAME    # Switch context
kubectl config set-context --current --namespace=NAMESPACE
```

## Resources

```bash
# Get resources
kubectl get pods                   # List pods
kubectl get pods -A                # All namespaces
kubectl get pods -n NAMESPACE      # Specific namespace
kubectl get pods -o wide           # More details
kubectl get pods -o yaml           # YAML output
kubectl get all                    # All resources
kubectl get deployments
kubectl get services
kubectl get nodes

# Describe resources
kubectl describe pod POD           # Pod details
kubectl describe node NODE         # Node details
kubectl describe service SERVICE   # Service details

# Create resources
kubectl create -f file.yaml        # Create from file
kubectl apply -f file.yaml         # Apply configuration
kubectl apply -f directory/        # Apply all in directory

# Delete resources
kubectl delete pod POD             # Delete pod
kubectl delete -f file.yaml        # Delete from file
kubectl delete deployment NAME     # Delete deployment
kubectl delete all --all           # Delete all resources
```

## Pods

```bash
# Pod operations
kubectl run nginx --image=nginx    # Run pod
kubectl exec POD -- COMMAND        # Execute command
kubectl exec -it POD -- bash       # Interactive shell
kubectl logs POD                   # View logs
kubectl logs -f POD                # Follow logs
kubectl logs POD -c CONTAINER      # Container logs
kubectl logs --previous POD        # Previous container logs

# Port forwarding
kubectl port-forward POD 8080:80   # Forward pod port
kubectl port-forward service/SVC 8080:80  # Forward service port

# Copy files
kubectl cp POD:/path/file /local/path     # From pod
kubectl cp /local/path POD:/path/file     # To pod
```

## Deployments

```bash
# Create deployment
kubectl create deployment NAME --image=IMAGE
kubectl create deployment nginx --image=nginx:latest

# Scale deployment
kubectl scale deployment NAME --replicas=3

# Update deployment
kubectl set image deployment/NAME CONTAINER=IMAGE:TAG
kubectl rollout restart deployment NAME

# Rollout management
kubectl rollout status deployment NAME     # Status
kubectl rollout history deployment NAME    # History
kubectl rollout undo deployment NAME       # Rollback
kubectl rollout undo deployment NAME --to-revision=2

# Autoscaling
kubectl autoscale deployment NAME --min=2 --max=10 --cpu-percent=80
```

## Services

```bash
# Expose deployment
kubectl expose deployment NAME --port=80 --type=LoadBalancer
kubectl expose pod POD --port=80 --type=NodePort

# Get service details
kubectl get services
kubectl get svc
kubectl describe service NAME
```

## ConfigMaps & Secrets

```bash
# ConfigMaps
kubectl create configmap NAME --from-file=file
kubectl create configmap NAME --from-literal=key=value
kubectl get configmaps
kubectl describe configmap NAME

# Secrets
kubectl create secret generic NAME --from-literal=password=secret
kubectl create secret docker-registry NAME \
  --docker-server=REGISTRY \
  --docker-username=USER \
  --docker-password=PASS
kubectl get secrets
kubectl describe secret NAME
```

## Debugging

```bash
# Events
kubectl get events                 # All events
kubectl get events -n NAMESPACE    # Namespace events
kubectl get events --sort-by=.metadata.creationTimestamp

# Troubleshooting
kubectl describe pod POD           # Detailed pod info
kubectl logs POD                   # Pod logs
kubectl logs POD --previous        # Previous container logs
kubectl exec -it POD -- sh         # Interactive shell
kubectl top nodes                  # Node resource usage
kubectl top pods                   # Pod resource usage
```

## Namespaces

```bash
# Create namespace
kubectl create namespace NAME

# Set default namespace
kubectl config set-context --current --namespace=NAME

# Delete namespace
kubectl delete namespace NAME
```

## Labels & Selectors

```bash
# Add label
kubectl label pod POD key=value

# Remove label
kubectl label pod POD key-

# Select by label
kubectl get pods -l key=value
kubectl get pods -l 'key in (value1,value2)'
kubectl get pods -l key!=value
```

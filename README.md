# Kubernetes API Schema Viewer

The Kubernetes API Schema Viewer (KASV) provides a dynamic view of your cluster's APIs. You deploy the application to your cluster as you would any other application.

## Features
Enjoy the following features:

- Locate any API available on your cluster, including Kubernetes built-ins and APIs provided through a custom resource definition (CRD)
- Vizualize and explore an API schema with the [Stoplight JSON schema viewer](https://github.com/stoplightio/json-schema-viewer)
- Bookmark any API's schema page for quick reference

## Implementation
KASV queries the Kubernetes API server to determine what APIs are available on your cluster. The following endpoints are consulted:

*Discovery endpoints*

- `/api/v1`: An `APIResourceList` object with Kubernetes built-in APIs
- `/apis`: An `APIGroupList` object with all API groups available for all of an API group's versions
- `/apis/<group>/<version>`: An `APIResourceList` object with all resources for an API group version

*OpenAPI spec emitters*

- `/openapi/v3/api/v1`: OpenAPI v3 spec for Kubernetes built-in APIs
- `/openapi/v3/apis/<group>/<version>`: OpenAPI v3 spec for a specific API group

## Installation
You can install KASV as a deployment to your Kubernetes cluster. For example, the following configuration works on an OpenShift cluster. You need to expose the application in whatever way is most appropriate for your cluster. On OpenShift, specifying an `Ingress` object creates a `Route` object internally.

Additionally, you'll need to provide the following values:
- `<tag>`: Specify a tag for `ghcr.io/jboxman/kasv` from the [available tags](https://github.com/jboxman/kubernetes-api-docs/pkgs/container/kasv/versions) or use `latest`
- `<cluster_domain>`: Specify the apps domain for your cluster. On OpenShift, enter the following command to retrieve your cluster's domain: `oc get -n openshift-config ingresses.config.openshift.io/cluster -o jsonpath='{.spec.domain}'`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kasv
  labels:
    app: kasv
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kasv
  template:
    metadata:
      labels:
        app: kasv
    spec:
      containers:
      - name: kasv
        image: ghcr.io/jboxman/kasv:<tag>
        imagePullPolicy: Always
        ports:
        - containerPort: 8080
          protocol: TCP
---
apiVersion: v1
kind: Service
metadata:
  name: kasv
  labels:
    app: kasv
spec:
  selector:
    app: kasv
  ports:
  - port: 8080
    protocol: TCP
    targetPort: 8080
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: kasv-ingress
  # OpenShift-specific
  annotations:
    route.openshift.io/termination: "edge"
spec:
  tls:
  # https://docs.openshift.com/container-platform/4.11/networking/routes/route-configuration.html#creating-edge-route-with-default-certificate_route-configuration
  - {}
  defaultBackend:
    service:
      name: kasv
      port:
        number: 8080
  rules:
  - host: kasv.<cluster_domain>
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: kasv
            port:
              number: 8080
```

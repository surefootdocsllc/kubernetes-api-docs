#!/bin/sh

set -e

if test -d "/var/run/secrets/kubernetes.io"; then
  export ENDPOINT=https://kubernetes.default.svc
  export SERVICEACCOUNT=/var/run/secrets/kubernetes.io/serviceaccount
  export TOKEN=$(cat ${SERVICEACCOUNT}/token)
  export CACERT=${SERVICEACCOUNT}/ca.crt
  # Useful for troubleshooting when set to `0`.
  export NODE_TLS_REJECT_UNAUTHORIZED=1
fi

# https://stackoverflow.com/questions/72855226/i-have-error-with-docker-compose-exited-with-code-243
#npm run start
./node_modules/.bin/remix-serve build

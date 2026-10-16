#!/bin/sh
# Runs from the nginx image's /docker-entrypoint.d before nginx starts. Writes the runtime
# environment config the SPA reads (window.__ENV__) from container environment variables.
# All of them are optional: an unset (or empty) variable leaves the SPA on its host-based default
# (see src/config.js), so existing deployments keep working unchanged.
set -eu

export NODE_ENV="${NODE_ENV:-}"
export API_URL="${API_URL:-}"
export MAIN_SITE="${MAIN_SITE:-}"
export LIBRARIES_URL="${LIBRARIES_URL:-}"
export LIBRARY_EDITOR_URL="${LIBRARY_EDITOR_URL:-}"
export DICTIONARY_URL="${DICTIONARY_URL:-}"

envsubst '${NODE_ENV} ${API_URL} ${MAIN_SITE} ${LIBRARIES_URL} ${LIBRARY_EDITOR_URL} ${DICTIONARY_URL}' \
    < /etc/nginx/env-config.js.template \
    > /usr/share/nginx/html/env-config.js

echo "env-config: NODE_ENV=${NODE_ENV} API_URL=${API_URL} MAIN_SITE=${MAIN_SITE} LIBRARIES_URL=${LIBRARIES_URL} LIBRARY_EDITOR_URL=${LIBRARY_EDITOR_URL} DICTIONARY_URL=${DICTIONARY_URL}"

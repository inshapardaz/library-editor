// Runtime environment config. Left empty for local development and plain hosting (src/config.js
// falls back to VITE_* vars and then to defaults based on the host). In the Docker image this file
// is regenerated at container startup from the API_URL / MAIN_SITE / LIBRARIES_URL /
// LIBRARY_EDITOR_URL / DICTIONARY_URL / NODE_ENV environment variables, when they are set.
window.__ENV__ = {};

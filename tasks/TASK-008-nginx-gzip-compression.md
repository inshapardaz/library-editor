# TASK-008: Enable Gzip Compression in nginx.conf

## Summary
`config/nginx/nginx.conf` does not enable gzip compression. The built React/Vite bundle (JS + CSS) can be 60–80% smaller when served with gzip, significantly improving initial load times, especially for Urdu users on slower connections.

## Current State
`nginx.conf` has rate-limiting and SPA routing configured correctly but no `gzip` directives.

## Proposed Change
Add inside the `http {}` block:

```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types
    text/plain
    text/css
    text/javascript
    application/javascript
    application/json
    application/xml
    image/svg+xml;
gzip_min_length 1024;
```

## Acceptance Criteria
- [ ] `nginx.conf` includes gzip directives.
- [ ] Docker build completes without nginx config errors (`nginx -t`).
- [ ] JS/CSS responses served with `Content-Encoding: gzip` header.

## Files to Change
- `config/nginx/nginx.conf`

## Priority
**Medium** — performance.

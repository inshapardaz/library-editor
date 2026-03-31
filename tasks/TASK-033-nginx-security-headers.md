# TASK-033: Add HTTP Security Headers to nginx

## Summary
`config/nginx/nginx.conf` serves the app with no HTTP security headers. This exposes users to clickjacking, MIME-sniffing, and cross-site scripting attacks. Modern browsers rely on these headers as a first line of defence, and their absence will fail a security audit.

## Headers to Add

| Header | Recommended Value | Protects Against |
|---|---|---|
| `X-Frame-Options` | `SAMEORIGIN` | Clickjacking |
| `X-Content-Type-Options` | `nosniff` | MIME-type sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Referrer leakage |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Feature abuse |
| `Content-Security-Policy` | See below | XSS, data injection |

### Suggested CSP (starting point — tighten over time)
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: blob: https:;
  connect-src 'self' http://api.nawishta.dev https://api.nawishta.co.uk;
  frame-ancestors 'none';
```

> **Note:** `unsafe-inline` for scripts is required while inline event handlers or `<style>` tags exist in the React bundle. After enabling, review the browser console for CSP violations and tighten the policy over several iterations.

## Steps
1. Add the headers listed above to the `server {}` block in `config/nginx/nginx.conf`.
2. Build the Docker image and open the app in a browser — check the console for CSP violations.
3. Iteratively tighten the CSP by removing `unsafe-inline` once all inline scripts are eliminated.
4. Verify headers are present using:
   ```bash
   curl -I https://editor.nawishta.co.uk
   ```

## Acceptance Criteria
- [ ] All five header types are present in `nginx.conf`.
- [ ] The app loads without CSP errors in Chrome and Firefox.
- [ ] `curl -I` against the deployed app returns all security headers.
- [ ] `X-Frame-Options: SAMEORIGIN` prevents the app from being embedded in an iframe.

## Files to Change
- `config/nginx/nginx.conf`

## Priority
**High** — security posture. Simple to implement, high protection value.

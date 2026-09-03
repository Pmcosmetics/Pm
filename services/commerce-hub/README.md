# Commerce Hub API

Minimal standalone Node.js service for the PM Cosmetics Commerce Hub.

## Local run

```bash
cd services/commerce-hub
npm start
```

The service exposes `/health` and the initial `/api/v1/products` and `/api/v1/skus` route skeletons. Persistence/auth integration is intentionally separated for the next implementation pass.

## Environment

Copy `.env.example` to your local environment and provide values locally. Never commit secrets or production credentials.

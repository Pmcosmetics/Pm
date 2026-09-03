# Migration 006 — Product Master

Adds the first Product Master schema for PM Cosmetics Hub: products, SKUs, media, channel mappings, inventory, pricing rules, and audit log.

## Conventions
- Uses `uuid` primary keys with `gen_random_uuid()`.
- Uses `timestamptz` timestamps and focused indexes.
- Enables RLS on every new table.
- Anonymous access is revoked; authenticated read/write access is intentionally limited by table.
- `service_role` receives full server-side access.

## Review points
- Confirm authenticated policies match the existing `orders` policy model.
- Apply and validate on staging before any production migration.
- This migration is intentionally additive and does not alter `public.orders`.

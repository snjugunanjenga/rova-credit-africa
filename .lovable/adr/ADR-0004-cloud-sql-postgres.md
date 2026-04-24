# ADR-0004: Cloud SQL for PostgreSQL 16 as primary datastore

- **Status:** Accepted
- **Date:** 2026-04-24

## Context
We need a relational store with strong consistency, point-in-time recovery, IAM auth, and a clear path to a regional HA setup. Candidates: Cloud SQL Postgres, AlloyDB, self-managed Postgres on GKE, Supabase.

## Decision
Use **Cloud SQL for PostgreSQL 16** in `europe-west1`, Private IP only, IAM database authentication, daily automated backups + PITR, regional HA enabled at GA.

## Rationale
- Postgres 16 covers JSONB (specifications), generated columns (lead_ref), partitioning (analytics_events), and `pg_cron` if needed.
- Cloud SQL is the lowest-ops managed Postgres on GCP at our scale.
- AlloyDB is over-spec'd for MVP traffic and ~3x the cost.
- Self-managed Postgres adds undifferentiated SRE work.
- Supabase was rejected at the target-architecture stage because we want full custody over compliance posture, IAM, and network isolation.

## Consequences
- Connections via Serverless VPC Connector — must monitor connector capacity.
- IAM auth requires Cloud SQL Auth Proxy in local dev; documented in `workflow.md`.
- Region pinned to `europe-west1` until Africa-region GA.

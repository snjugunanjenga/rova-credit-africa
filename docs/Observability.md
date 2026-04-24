# Observability

## Telemetry Pillars
- Logs: structured and correlated with trace IDs.
- Metrics: API latency, queue lag, stage conversion, error rates.
- Traces: distributed spans across API, workers, and integrations.

## Core SLIs
- Stage transition success rate.
- Time-to-completion from intake to activation.
- Integration success rate by provider.
- Queue processing latency and dead-letter volume.

## Alerting
- High error rate on eligibility checks.
- Sustained queue lag for background workers.
- Spike in Stage 3 fallback from Stage 4.
- Failed agreement delivery above threshold.

## Dashboards
- Executive funnel and NPL risk trends.
- Partner performance and exception heatmap.
- Engineering reliability dashboard for APIs and workers.

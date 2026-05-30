import { Router } from "express";

const syncRouter = Router();

// Retry and conflict-resolution policy consumed by offline clients (T622).
// Clients use these parameters to implement exponential backoff and to
// understand which conflict strategy the server enforces per resource.
const SYNC_POLICY = {
  retry: {
    max_attempts: 3,
    initial_delay_ms: 1000,
    max_delay_ms: 30_000,
    multiplier: 2.0,
    jitter_factor: 0.2,
  },
  conflict_resolution: {
    strategy: "completed_wins",
    description:
      "Once a lesson is marked completed on the server it cannot be reverted by a deferred offline write. " +
      "For version conflicts (stale If-Match) the client must re-fetch the current state and retry.",
    supported_resources: ["progress"],
    version_header: "If-Match",
    version_response_header: "ETag",
  },
} as const;

syncRouter.get("/sync/policy", (_req, res) => {
  res.json({ data: SYNC_POLICY });
});

export { syncRouter };

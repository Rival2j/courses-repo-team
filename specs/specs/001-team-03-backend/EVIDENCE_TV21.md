# TV21 Implementation Evidence

**Task**: TV21 [P] [FV] [TEAM-03] - Create `cursos.resource_views` table

**Date**: 2026-05-26
**Status**: IMPLEMENTED
**Language**: Español (Technical Documentation in English/Spanish)

## Summary

Implemented the `cursos.resource_views` table for tracking user engagement with resources via server-side heartbeats. This table enables resource completion verification, engagement metrics, and domain event triggering.

## Deliverables

### 1. Database Migration
- **File**: `supabase/migrations/20260523000002_resource_views.sql`
- **Changes**:
  - Created `cursos.resource_views` table with:
    - `id` (uuid, PK, auto-generated)
    - `user_id` (uuid, FK to `cursos.profiles`, with cascading delete)
    - `resource_id` (uuid, for linking to resources)
    - `session_id` (uuid, client-generated session identifier)
    - `started_at` (timestamptz, record creation timestamp)
    - `last_seen_at` (timestamptz, last heartbeat timestamp)
    - `duration_ms` (bigint, server-calculated cumulative duration in milliseconds)
    - `created_at` (timestamptz, insertion timestamp)
  - **Constraints**:
    - UNIQUE on `(user_id, resource_id, session_id)` for idempotency
    - CHECK constraint: `duration_ms >= 0` (non-negative durations)
  - **RLS Policies** (4 total):
    - `resource_views_select_own`: Users can SELECT only their own records
    - `resource_views_insert_own`: Users can INSERT only their own records
    - `resource_views_update_own`: Users can UPDATE only their own records
    - `resource_views_service_role`: Service role (backend/Edge Functions) can perform all operations
  - **Indexes** (5 total):
    - `idx_resource_views_user_id`: For queries filtering by user
    - `idx_resource_views_resource_id`: For queries filtering by resource
    - `idx_resource_views_session_id`: For session-based lookups
    - `idx_resource_views_created_at`: For time-based retention queries (DESC)
    - `idx_resource_views_user_resource`: Composite index for common `(user_id, resource_id)` queries
  - **Retention Policy Documentation**: Added comments for manual cleanup via `DELETE` jobs targeting records older than 90 days

### 2. SQL Schema Validation
- **Validation Results**:
  - ✓ CREATE TABLE statement: 1 (Table created successfully)
  - ✓ PRIMARY KEY constraint: Present
  - ✓ UNIQUE constraint: Present on `(user_id, resource_id, session_id)`
  - ✓ RLS policies: 4 policies created (select_own, insert_own, update_own, service_role)
  - ✓ Indexes: 5 indexes created (user_id, resource_id, session_id, created_at, user_resource composite)
  - ✓ ALTER TABLE for RLS: RLS enabled with `ENABLE ROW LEVEL SECURITY`

### 3. Integration Tests
- **File**: `projects/rest-api/lms_api/test/integration.test.ts`
- **Test Cases Added** (3 comprehensive tests):

#### Test 1: `TV21: resource_views table exists with correct schema and RLS policies`
- Validates table structure with correct column types (uuid, timestamptz, bigint)
- Verifies all 5 indexes are created
- Confirms RLS is enabled on the table
- Confirms all 4 RLS policies exist with correct names
- **Purpose**: Structural validation

#### Test 2: `TV21: resource_views UNIQUE constraint and duration calculations`
- Tests UNIQUE constraint enforcement on `(user_id, resource_id, session_id)`
- Validates UPSERT behavior for idempotency (ON CONFLICT DO UPDATE)
- Verifies duration calculations and updates
- Tests CHECK constraint rejection of negative durations
- **Purpose**: Data integrity and operational correctness

#### Test 3: `TV21: resource_views RLS policies restrict access appropriately`
- Creates two users with separate resource views
- Verifies service role can access all records
- Confirms individual users can insert/view their own records
- **Purpose**: Security validation (RLS enforcement)

### 4. Configuration & Documentation

#### Database Configuration
- Schema: `cursos` (consistent with project standard)
- Connection: Supabase remote (`xqtfovmmndsloqnyqhfv`) and local development

#### Documentation
- Added SQL comments for table and column documentation
- Retention policy documented (90+ days minimum TTL)
- RLS security model documented in code

## Technical Details

### UNIQUE Constraint Rationale
The UNIQUE constraint on `(user_id, resource_id, session_id)` ensures:
- Each user can have at most one "view session" per resource
- Idempotent UPSERT operations via `ON CONFLICT DO UPDATE`
- Prevents accidental double-counting of duration
- Session-based grouping of heartbeats

### RLS Security Model
- **Client-side requests**: Users can only read/write their own records (auth.uid() = user_id)
- **Backend/Edge Functions**: Service role (via JWT `role: 'service_role'`) can perform all operations
- **Compliance**: Prevents unauthorized access to other users' engagement data

### Indexes Strategy
- `user_id` + `resource_id`: Most common filtering combinations
- `session_id`: For session-based queries (e.g., client-driven sync)
- `created_at DESC`: For retention cleanup jobs (finding old records)
- Composite index on `(user_id, resource_id)`: Optimizes typical query patterns

### Retention Policy
- Manual cleanup via cron job (Supabase pg_cron or external scheduler)
- Target: Delete records where `created_at < NOW() - INTERVAL '90 days'`
- Rationale: Balances audit trails with storage efficiency

## Traceability

### Requirement Mapping (from spec_extensions/resource_views.md)
- ✓ Table creation with minimal schema (user_id, resource_id, session_id, started_at, last_seen_at, duration_ms)
- ✓ UNIQUE constraint on (user_id, resource_id, session_id)
- ✓ RLS: Only user or service role can write own views
- ✓ Operational indices for performance
- ✓ Retention policy ≥ 90 days documented

### Related Tasks
- Dependency: None (foundational for FV phase)
- Downstream: TV22 (heartbeat endpoint), TV23 (threshold completion logic), TV24 (integration E2E tests)

## Validation Checklist

- [x] Migration file created and validated (SQL syntax)
- [x] Schema matches specification (columns, constraints, indexes)
- [x] RLS policies implemented (4 policies, correct USING/WITH CHECK clauses)
- [x] Integration tests written (3 comprehensive test cases)
- [x] Documentation created (this file)
- [x] Traceability to spec_extensions/resource_views.md established
- [x] No deployment (local validation only)

## Next Steps (TV22+)

1. **TV22**: Implement heartbeat endpoint (`POST /api/resources/:resourceId/heartbeat`)
   - UPSERT logic in `cursos.resource_views`
   - Server-side timestamp calculation
   - Enrollment validation before accepting heartbeat
   - Idempotency via `ON CONFLICT`

2. **TV23**: Implement threshold completion logic
   - Monitor `duration_ms >= THRESHOLD_MS` (default 300000 ms)
   - Atomic transaction: Update `progress.completed`, emit `domain_events`
   - One-time emission guarantee

3. **TV24**: E2E integration tests
   - Full heartbeat flow
   - Threshold triggering
   - Event deduplication
   - RLS enforcement in live scenarios

## Files Modified

1. `supabase/migrations/20260523000002_resource_views.sql` - NEW
2. `projects/rest-api/lms_api/test/integration.test.ts` - MODIFIED (added 3 tests)
3. `specs/001-team-03-backend/tasks.md` - PENDING MARK AS COMPLETE

## Testing Instructions

### Local Setup
```bash
# Copy environment template
cp .env.example .env

# Configure .env with local Supabase connection
# SUPABASE_CONNECTION_STRING=postgresql://user:password@localhost:5432/postgres

# Start Supabase locally (if not running)
npx supabase start

# Run integration tests
cd projects/rest-api/lms_api
npm install
npm test -- test/integration.test.ts
```

### Expected Test Output
```
[✓] TV21: resource_views table exists with correct schema and RLS policies
[✓] TV21: resource_views UNIQUE constraint and duration calculations
[✓] TV21: resource_views RLS policies restrict access appropriately
```

## Notes

- Migration uses `IF NOT EXISTS` clauses for idempotency
- RLS policies use `IF NOT EXISTS` to avoid conflicts
- CHECK constraint ensures data consistency (no negative durations)
- Cascading DELETE on user profile deletion ensures referential integrity
- All timestamps use server time (via `now()` function) to prevent clock-skew issues

---

**Task Status**: IMPLEMENTED (TV21)
**Evidence**: Migration SQL + Integration Tests + Documentation
**Next Review**: Implementation of TV22 (heartbeat endpoint)

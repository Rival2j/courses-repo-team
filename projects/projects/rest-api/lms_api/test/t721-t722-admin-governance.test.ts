import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDatabaseClient } from "../src/lib/database";
import type { PostgresError } from "postgres";

describe("T721 & T722: Administrative Governance & Institutional Policies", () => {
  const database = getDatabaseClient();
  let orgUnitId: string;
  let policyTemplateId: string;
  let adminScopeId: string;
  let userId: string;

  beforeAll(async () => {
    // Insert test organizational unit
    const orgUnits = await database`
      INSERT INTO cursos.organizational_units (slug, name, description)
      VALUES ('test-org', 'Test Organization', 'Test organizational unit')
      ON CONFLICT (slug) DO UPDATE SET updated_at = NOW()
      RETURNING id
    `;
    orgUnitId = orgUnits[0].id as string;

    // Insert policy template
    const templates = await database`
      INSERT INTO cursos.policy_templates (slug, name, policy_type, policy_schema)
      VALUES ('test-template', 'Test Policy Template', 'enrollment', '{"max_enrollments": 100}')
      ON CONFLICT (slug) DO UPDATE SET updated_at = NOW()
      RETURNING id
    `;
    policyTemplateId = templates[0].id as string;

    // Get a test user ID (using a dummy UUID for testing)
    userId = "550e8400-e29b-41d4-a716-446655440000";
  });

  afterAll(async () => {
    // Cleanup test data
    await database`
      DELETE FROM cursos.admin_scopes WHERE organizational_unit_id = ${orgUnitId}
    `;
    await database`
      DELETE FROM cursos.institutional_policies WHERE organizational_unit_id = ${orgUnitId}
    `;
    await database`
      DELETE FROM cursos.institutional_branding WHERE organizational_unit_id = ${orgUnitId}
    `;
    await database`
      DELETE FROM cursos.organizational_units WHERE id = ${orgUnitId}
    `;
  });

  describe("T721: Server-side Admin Scope Enforcement", () => {
    it("should create an organizational unit with valid data", async () => {
      const result = await database`
        SELECT id, slug, name, is_active
        FROM cursos.organizational_units
        WHERE id = ${orgUnitId}
      `;

      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe("test-org");
      expect(result[0].is_active).toBe(true);
    });

    it("should enforce unique organizational unit slugs", async () => {
      const error = await database`
        INSERT INTO cursos.organizational_units (slug, name)
        VALUES ('test-org', 'Duplicate Organization')
      `.catch((e: PostgresError) => e);

      expect(error).toBeInstanceOf(Error);
      expect(error.code).toBe("23505"); // unique violation
    });

    it("should create admin scopes with role enforcement", async () => {
      const adminScopes = await database`
        INSERT INTO cursos.admin_scopes (
          user_id, organizational_unit_id, role, scope_level, permissions
        ) VALUES (
          ${userId}, ${orgUnitId}, 'admin', 'organizational_unit',
          '["read", "write", "moderate"]'
        )
        RETURNING id, role, scope_level
      `;

      expect(adminScopes).toHaveLength(1);
      expect(adminScopes[0].role).toBe("admin");
      expect(adminScopes[0].scope_level).toBe("organizational_unit");
      adminScopeId = adminScopes[0].id as string;
    });

    it("should enforce unique admin scope per user/org/role", async () => {
      const error = await database`
        INSERT INTO cursos.admin_scopes (
          user_id, organizational_unit_id, role, scope_level
        ) VALUES (
          ${userId}, ${orgUnitId}, 'admin', 'organizational_unit'
        )
      `.catch((e: PostgresError) => e);

      expect(error).toBeInstanceOf(Error);
      expect(error.code).toBe("23505"); // unique violation
    });

    it("should validate admin scope role values", async () => {
      const error = await database`
        INSERT INTO cursos.admin_scopes (
          user_id, organizational_unit_id, role, scope_level
        ) VALUES (
          '550e8400-e29b-41d4-a716-446655440001', ${orgUnitId},
          'invalid_role', 'organizational_unit'
        )
      `.catch((e: PostgresError) => e);

      expect(error).toBeInstanceOf(Error);
      expect(error.code).toBe("23514"); // check constraint violation
    });
  });

  describe("T722: Institutional Policies & Governance Contracts", () => {
    it("should create institutional branding per organizational unit", async () => {
      const branding = await database`
        INSERT INTO cursos.institutional_branding (
          organizational_unit_id, institution_name, primary_color,
          secondary_color, accent_color
        ) VALUES (
          ${orgUnitId}, 'Test Institution', '#000000',
          '#FFFFFF', '#0066CC'
        )
        RETURNING id, institution_name, is_active
      `;

      expect(branding).toHaveLength(1);
      expect(branding[0].institution_name).toBe("Test Institution");
      expect(branding[0].is_active).toBe(true);
    });

    it("should enforce unique active branding per organizational unit", async () => {
      // Try to insert a second active branding for the same org unit
      const error = await database`
        INSERT INTO cursos.institutional_branding (
          organizational_unit_id, institution_name, primary_color,
          secondary_color, accent_color
        ) VALUES (
          ${orgUnitId}, 'Another Institution', '#000000',
          '#FFFFFF', '#0066CC'
        )
      `.catch((e: PostgresError) => e);

      expect(error).toBeInstanceOf(Error);
      expect(error.code).toBe("23505"); // unique violation
    });

    it("should create institutional policies from templates", async () => {
      const policies = await database`
        INSERT INTO cursos.institutional_policies (
          organizational_unit_id, policy_template_id, name, policy_type,
          policy_rules, enforcement_level, applies_to_roles, created_by
        ) VALUES (
          ${orgUnitId}, ${policyTemplateId}, 'Test Policy', 'enrollment',
          '{"max_enrollments": 100}', 'mandatory',
          '["alumno", "instructor"]'::TEXT[], ${userId}
        )
        RETURNING id, name, enforcement_level, version
      `;

      expect(policies).toHaveLength(1);
      expect(policies[0].name).toBe("Test Policy");
      expect(policies[0].enforcement_level).toBe("mandatory");
      expect(policies[0].version).toBe(1);
    });

    it("should support policy versioning on updates", async () => {
      const policyId = (
        await database`
          SELECT id FROM cursos.institutional_policies
          WHERE organizational_unit_id = ${orgUnitId}
          LIMIT 1
        `
      )[0].id;

      const updated = await database`
        UPDATE cursos.institutional_policies
        SET policy_rules = '{"max_enrollments": 200}', version = version + 1
        WHERE id = ${policyId}
        RETURNING version, policy_rules
      `;

      expect(updated[0].version).toBe(2);
      expect(updated[0].policy_rules).toEqual({ max_enrollments: 200 });
    });

    it("should retrieve applicable policies by role and type", async () => {
      const policies = await database`
        SELECT id, name, enforcement_level, applies_to_roles
        FROM cursos.institutional_policies
        WHERE organizational_unit_id = ${orgUnitId}
          AND policy_type = 'enrollment'
          AND is_active = true
          AND applies_to_roles @> ARRAY['alumno']::TEXT[]
        ORDER BY enforcement_level DESC
      `;

      expect(policies.length).toBeGreaterThan(0);
      expect(policies[0].enforcement_level).toBeDefined();
    });
  });

  describe("Global Configuration Management", () => {
    it("should create global configurations", async () => {
      const config = await database`
        INSERT INTO cursos.global_configurations (
          config_key, config_value, description, is_secret
        ) VALUES (
          'test_config', '{"value": "test_value"}', 'Test configuration', false
        )
        ON CONFLICT (config_key) DO UPDATE
        SET config_value = EXCLUDED.config_value
        RETURNING config_key, config_value, is_secret
      `;

      expect(config).toHaveLength(1);
      expect(config[0].config_key).toBe("test_config");
      expect(config[0].is_secret).toBe(false);
    });

    it("should mark configurations as secret when needed", async () => {
      const config = await database`
        INSERT INTO cursos.global_configurations (
          config_key, config_value, is_secret
        ) VALUES (
          'secret_config', '{"api_key": "secret_value"}', true
        )
        ON CONFLICT (config_key) DO UPDATE
        SET config_value = EXCLUDED.config_value
        RETURNING is_secret
      `;

      expect(config[0].is_secret).toBe(true);
    });
  });

  describe("Moderation Audit Trail", () => {
    it("should log moderation actions", async () => {
      const actions = await database`
        INSERT INTO cursos.moderation_actions (
          actor_id, action_type, target_resource_type,
          target_resource_id, reason
        ) VALUES (
          ${userId}, 'user_suspend', 'user',
          '550e8400-e29b-41d4-a716-446655440001'::UUID,
          'Violación de términos de servicio'
        )
        RETURNING id, action_type, reason
      `;

      expect(actions).toHaveLength(1);
      expect(actions[0].action_type).toBe("user_suspend");
    });

    it("should validate moderation action types", async () => {
      const error = await database`
        INSERT INTO cursos.moderation_actions (
          actor_id, action_type, target_resource_type,
          target_resource_id, reason
        ) VALUES (
          ${userId}, 'invalid_action', 'user',
          '550e8400-e29b-41d4-a716-446655440001'::UUID,
          'Test reason'
        )
      `.catch((e: PostgresError) => e);

      expect(error).toBeInstanceOf(Error);
      expect(error.code).toBe("23514"); // check constraint violation
    });
  });

  describe("Helper Functions", () => {
    it("should check admin scope using helper function", async () => {
      const result = await database`
        SELECT cursos.user_has_admin_scope(
          ${userId},
          ${orgUnitId},
          'organizational_unit'
        ) as has_scope
      `;

      expect(result[0].has_scope).toBe(true);
    });

    it("should log moderation action using helper", async () => {
      const actionId = await database`
        SELECT cursos.log_moderation_action(
          'content_remove'::TEXT,
          'course'::TEXT,
          '550e8400-e29b-41d4-a716-446655440001'::UUID,
          'Contenido inapropiado'::TEXT
        ) as action_id
      `;

      expect(actionId[0].action_id).toBeDefined();
    });

    it("should get applicable policies by role", async () => {
      const policies = await database`
        SELECT id, policy_name, enforcement_level
        FROM cursos.get_applicable_policies(
          ${orgUnitId},
          'enrollment'::TEXT,
          'alumno'::TEXT
        )
      `;

      expect(policies).toBeDefined();
    });
  });
});

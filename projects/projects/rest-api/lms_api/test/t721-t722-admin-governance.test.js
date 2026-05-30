"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const database_1 = require("../src/lib/database");
(0, vitest_1.describe)("T721 & T722: Administrative Governance & Institutional Policies", () => {
    const database = (0, database_1.getDatabaseClient)();
    let orgUnitId;
    let policyTemplateId;
    let adminScopeId;
    let userId;
    (0, vitest_1.beforeAll)(async () => {
        // Insert test organizational unit
        const orgUnits = await database `
      INSERT INTO cursos.organizational_units (slug, name, description)
      VALUES ('test-org', 'Test Organization', 'Test organizational unit')
      ON CONFLICT (slug) DO UPDATE SET updated_at = NOW()
      RETURNING id
    `;
        orgUnitId = orgUnits[0].id;
        // Insert policy template
        const templates = await database `
      INSERT INTO cursos.policy_templates (slug, name, policy_type, policy_schema)
      VALUES ('test-template', 'Test Policy Template', 'enrollment', '{"max_enrollments": 100}')
      ON CONFLICT (slug) DO UPDATE SET updated_at = NOW()
      RETURNING id
    `;
        policyTemplateId = templates[0].id;
        // Get a test user ID (using a dummy UUID for testing)
        userId = "550e8400-e29b-41d4-a716-446655440000";
    });
    (0, vitest_1.afterAll)(async () => {
        // Cleanup test data
        await database `
      DELETE FROM cursos.admin_scopes WHERE organizational_unit_id = ${orgUnitId}
    `;
        await database `
      DELETE FROM cursos.institutional_policies WHERE organizational_unit_id = ${orgUnitId}
    `;
        await database `
      DELETE FROM cursos.institutional_branding WHERE organizational_unit_id = ${orgUnitId}
    `;
        await database `
      DELETE FROM cursos.organizational_units WHERE id = ${orgUnitId}
    `;
    });
    (0, vitest_1.describe)("T721: Server-side Admin Scope Enforcement", () => {
        (0, vitest_1.it)("should create an organizational unit with valid data", async () => {
            const result = await database `
        SELECT id, slug, name, is_active
        FROM cursos.organizational_units
        WHERE id = ${orgUnitId}
      `;
            (0, vitest_1.expect)(result).toHaveLength(1);
            (0, vitest_1.expect)(result[0].slug).toBe("test-org");
            (0, vitest_1.expect)(result[0].is_active).toBe(true);
        });
        (0, vitest_1.it)("should enforce unique organizational unit slugs", async () => {
            const error = await database `
        INSERT INTO cursos.organizational_units (slug, name)
        VALUES ('test-org', 'Duplicate Organization')
      `.catch((e) => e);
            (0, vitest_1.expect)(error).toBeInstanceOf(Error);
            (0, vitest_1.expect)(error.code).toBe("23505"); // unique violation
        });
        (0, vitest_1.it)("should create admin scopes with role enforcement", async () => {
            const adminScopes = await database `
        INSERT INTO cursos.admin_scopes (
          user_id, organizational_unit_id, role, scope_level, permissions
        ) VALUES (
          ${userId}, ${orgUnitId}, 'admin', 'organizational_unit',
          '["read", "write", "moderate"]'
        )
        RETURNING id, role, scope_level
      `;
            (0, vitest_1.expect)(adminScopes).toHaveLength(1);
            (0, vitest_1.expect)(adminScopes[0].role).toBe("admin");
            (0, vitest_1.expect)(adminScopes[0].scope_level).toBe("organizational_unit");
            adminScopeId = adminScopes[0].id;
        });
        (0, vitest_1.it)("should enforce unique admin scope per user/org/role", async () => {
            const error = await database `
        INSERT INTO cursos.admin_scopes (
          user_id, organizational_unit_id, role, scope_level
        ) VALUES (
          ${userId}, ${orgUnitId}, 'admin', 'organizational_unit'
        )
      `.catch((e) => e);
            (0, vitest_1.expect)(error).toBeInstanceOf(Error);
            (0, vitest_1.expect)(error.code).toBe("23505"); // unique violation
        });
        (0, vitest_1.it)("should validate admin scope role values", async () => {
            const error = await database `
        INSERT INTO cursos.admin_scopes (
          user_id, organizational_unit_id, role, scope_level
        ) VALUES (
          '550e8400-e29b-41d4-a716-446655440001', ${orgUnitId},
          'invalid_role', 'organizational_unit'
        )
      `.catch((e) => e);
            (0, vitest_1.expect)(error).toBeInstanceOf(Error);
            (0, vitest_1.expect)(error.code).toBe("23514"); // check constraint violation
        });
    });
    (0, vitest_1.describe)("T722: Institutional Policies & Governance Contracts", () => {
        (0, vitest_1.it)("should create institutional branding per organizational unit", async () => {
            const branding = await database `
        INSERT INTO cursos.institutional_branding (
          organizational_unit_id, institution_name, primary_color,
          secondary_color, accent_color
        ) VALUES (
          ${orgUnitId}, 'Test Institution', '#000000',
          '#FFFFFF', '#0066CC'
        )
        RETURNING id, institution_name, is_active
      `;
            (0, vitest_1.expect)(branding).toHaveLength(1);
            (0, vitest_1.expect)(branding[0].institution_name).toBe("Test Institution");
            (0, vitest_1.expect)(branding[0].is_active).toBe(true);
        });
        (0, vitest_1.it)("should enforce unique active branding per organizational unit", async () => {
            // Try to insert a second active branding for the same org unit
            const error = await database `
        INSERT INTO cursos.institutional_branding (
          organizational_unit_id, institution_name, primary_color,
          secondary_color, accent_color
        ) VALUES (
          ${orgUnitId}, 'Another Institution', '#000000',
          '#FFFFFF', '#0066CC'
        )
      `.catch((e) => e);
            (0, vitest_1.expect)(error).toBeInstanceOf(Error);
            (0, vitest_1.expect)(error.code).toBe("23505"); // unique violation
        });
        (0, vitest_1.it)("should create institutional policies from templates", async () => {
            const policies = await database `
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
            (0, vitest_1.expect)(policies).toHaveLength(1);
            (0, vitest_1.expect)(policies[0].name).toBe("Test Policy");
            (0, vitest_1.expect)(policies[0].enforcement_level).toBe("mandatory");
            (0, vitest_1.expect)(policies[0].version).toBe(1);
        });
        (0, vitest_1.it)("should support policy versioning on updates", async () => {
            const policyId = (await database `
          SELECT id FROM cursos.institutional_policies
          WHERE organizational_unit_id = ${orgUnitId}
          LIMIT 1
        `)[0].id;
            const updated = await database `
        UPDATE cursos.institutional_policies
        SET policy_rules = '{"max_enrollments": 200}', version = version + 1
        WHERE id = ${policyId}
        RETURNING version, policy_rules
      `;
            (0, vitest_1.expect)(updated[0].version).toBe(2);
            (0, vitest_1.expect)(updated[0].policy_rules).toEqual({ max_enrollments: 200 });
        });
        (0, vitest_1.it)("should retrieve applicable policies by role and type", async () => {
            const policies = await database `
        SELECT id, name, enforcement_level, applies_to_roles
        FROM cursos.institutional_policies
        WHERE organizational_unit_id = ${orgUnitId}
          AND policy_type = 'enrollment'
          AND is_active = true
          AND applies_to_roles @> ARRAY['alumno']::TEXT[]
        ORDER BY enforcement_level DESC
      `;
            (0, vitest_1.expect)(policies.length).toBeGreaterThan(0);
            (0, vitest_1.expect)(policies[0].enforcement_level).toBeDefined();
        });
    });
    (0, vitest_1.describe)("Global Configuration Management", () => {
        (0, vitest_1.it)("should create global configurations", async () => {
            const config = await database `
        INSERT INTO cursos.global_configurations (
          config_key, config_value, description, is_secret
        ) VALUES (
          'test_config', '{"value": "test_value"}', 'Test configuration', false
        )
        ON CONFLICT (config_key) DO UPDATE
        SET config_value = EXCLUDED.config_value
        RETURNING config_key, config_value, is_secret
      `;
            (0, vitest_1.expect)(config).toHaveLength(1);
            (0, vitest_1.expect)(config[0].config_key).toBe("test_config");
            (0, vitest_1.expect)(config[0].is_secret).toBe(false);
        });
        (0, vitest_1.it)("should mark configurations as secret when needed", async () => {
            const config = await database `
        INSERT INTO cursos.global_configurations (
          config_key, config_value, is_secret
        ) VALUES (
          'secret_config', '{"api_key": "secret_value"}', true
        )
        ON CONFLICT (config_key) DO UPDATE
        SET config_value = EXCLUDED.config_value
        RETURNING is_secret
      `;
            (0, vitest_1.expect)(config[0].is_secret).toBe(true);
        });
    });
    (0, vitest_1.describe)("Moderation Audit Trail", () => {
        (0, vitest_1.it)("should log moderation actions", async () => {
            const actions = await database `
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
            (0, vitest_1.expect)(actions).toHaveLength(1);
            (0, vitest_1.expect)(actions[0].action_type).toBe("user_suspend");
        });
        (0, vitest_1.it)("should validate moderation action types", async () => {
            const error = await database `
        INSERT INTO cursos.moderation_actions (
          actor_id, action_type, target_resource_type,
          target_resource_id, reason
        ) VALUES (
          ${userId}, 'invalid_action', 'user',
          '550e8400-e29b-41d4-a716-446655440001'::UUID,
          'Test reason'
        )
      `.catch((e) => e);
            (0, vitest_1.expect)(error).toBeInstanceOf(Error);
            (0, vitest_1.expect)(error.code).toBe("23514"); // check constraint violation
        });
    });
    (0, vitest_1.describe)("Helper Functions", () => {
        (0, vitest_1.it)("should check admin scope using helper function", async () => {
            const result = await database `
        SELECT cursos.user_has_admin_scope(
          ${userId},
          ${orgUnitId},
          'organizational_unit'
        ) as has_scope
      `;
            (0, vitest_1.expect)(result[0].has_scope).toBe(true);
        });
        (0, vitest_1.it)("should log moderation action using helper", async () => {
            const actionId = await database `
        SELECT cursos.log_moderation_action(
          'content_remove'::TEXT,
          'course'::TEXT,
          '550e8400-e29b-41d4-a716-446655440001'::UUID,
          'Contenido inapropiado'::TEXT
        ) as action_id
      `;
            (0, vitest_1.expect)(actionId[0].action_id).toBeDefined();
        });
        (0, vitest_1.it)("should get applicable policies by role", async () => {
            const policies = await database `
        SELECT id, policy_name, enforcement_level
        FROM cursos.get_applicable_policies(
          ${orgUnitId},
          'enrollment'::TEXT,
          'alumno'::TEXT
        )
      `;
            (0, vitest_1.expect)(policies).toBeDefined();
        });
    });
});

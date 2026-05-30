import { z } from "zod";

// =====================================================================
// T906: Domain constants — centraliza los valores válidos de cada campo
// para eliminar magic strings en rutas, migraciones y contratos TEAM-02
// =====================================================================

export const POLICY_TYPES = ["enrollment", "evaluation", "progression", "completion", "access", "custom"] as const;
export type PolicyType = (typeof POLICY_TYPES)[number];

export const ACTION_TYPES = ["user_suspend", "user_reactivate", "content_flag", "content_remove", "role_change", "policy_override", "custom"] as const;
export type ActionType = (typeof ACTION_TYPES)[number];

export const ENFORCEMENT_LEVELS = ["mandatory", "advisory", "informational"] as const;
export type EnforcementLevel = (typeof ENFORCEMENT_LEVELS)[number];

export const SCOPE_LEVELS = ["global", "organizational_unit", "restricted"] as const;
export type ScopeLevel = (typeof SCOPE_LEVELS)[number];

export const ADMIN_ROLES = ["super_admin", "admin", "moderador"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

// =====================================================================
// Organizational Units DTOs
// =====================================================================
export const OrganizationalUnitDtoSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  parent_unit_id: z.string().uuid().nullable(),
  metadata: z.record(z.unknown()).nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type OrganizationalUnitDto = z.infer<typeof OrganizationalUnitDtoSchema>;

export const OrganizationalUnitCreateSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  name: z.string().min(1),
  description: z.string().optional(),
  parent_unit_id: z.string().uuid().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type OrganizationalUnitCreate = z.infer<typeof OrganizationalUnitCreateSchema>;

export const OrganizationalUnitUpdateSchema = OrganizationalUnitCreateSchema.partial();

// =====================================================================
// Institutional Branding DTOs
// =====================================================================
export const InstitutionalBrandingDtoSchema = z.object({
  id: z.string().uuid(),
  organizational_unit_id: z.string().uuid(),
  logo_url: z.string().nullable(),
  primary_color: z.string(),
  secondary_color: z.string(),
  accent_color: z.string(),
  institution_name: z.string(),
  institution_website: z.string().nullable(),
  support_email: z.string().email().nullable(),
  support_phone: z.string().nullable(),
  metadata: z.record(z.unknown()).nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type InstitutionalBrandingDto = z.infer<typeof InstitutionalBrandingDtoSchema>;

export const InstitutionalBrandingCreateSchema = z.object({
  organizational_unit_id: z.string().uuid(),
  logo_url: z.string().url().optional(),
  primary_color: z.string().regex(/^#[0-9A-F]{6}$/i),
  secondary_color: z.string().regex(/^#[0-9A-F]{6}$/i),
  accent_color: z.string().regex(/^#[0-9A-F]{6}$/i),
  institution_name: z.string().min(1),
  institution_website: z.string().url().optional(),
  support_email: z.string().email().optional(),
  support_phone: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type InstitutionalBrandingCreate = z.infer<typeof InstitutionalBrandingCreateSchema>;

export const InstitutionalBrandingUpdateSchema = InstitutionalBrandingCreateSchema.partial();

// =====================================================================
// Policy Templates DTOs
// =====================================================================
export const PolicyTemplateDtoSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  policy_type: z.enum(["enrollment", "evaluation", "progression", "completion", "access", "custom"]),
  policy_schema: z.record(z.unknown()),
  is_template: z.boolean(),
  is_active: z.boolean(),
  version: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type PolicyTemplateDto = z.infer<typeof PolicyTemplateDtoSchema>;

export const PolicyTemplateCreateSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  name: z.string().min(1),
  description: z.string().optional(),
  policy_type: z.enum(["enrollment", "evaluation", "progression", "completion", "access", "custom"]),
  policy_schema: z.record(z.unknown()),
});

export type PolicyTemplateCreate = z.infer<typeof PolicyTemplateCreateSchema>;

export const PolicyTemplateUpdateSchema = PolicyTemplateCreateSchema.partial();

// =====================================================================
// Institutional Policies DTOs
// =====================================================================
export const InstitutionalPolicyDtoSchema = z.object({
  id: z.string().uuid(),
  organizational_unit_id: z.string().uuid(),
  policy_template_id: z.string().uuid().nullable(),
  name: z.string(),
  description: z.string().nullable(),
  policy_type: z.enum(["enrollment", "evaluation", "progression", "completion", "access", "custom"]),
  policy_rules: z.record(z.unknown()),
  enforcement_level: z.enum(["mandatory", "advisory", "informational"]),
  applies_to_roles: z.array(z.string()),
  is_active: z.boolean(),
  version: z.number().int(),
  created_by: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type InstitutionalPolicyDto = z.infer<typeof InstitutionalPolicyDtoSchema>;

export const InstitutionalPolicyCreateSchema = z.object({
  organizational_unit_id: z.string().uuid(),
  policy_template_id: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  policy_type: z.enum(["enrollment", "evaluation", "progression", "completion", "access", "custom"]),
  policy_rules: z.record(z.unknown()),
  enforcement_level: z.enum(["mandatory", "advisory", "informational"]).optional(),
  applies_to_roles: z.array(z.string()).optional(),
});

export type InstitutionalPolicyCreate = z.infer<typeof InstitutionalPolicyCreateSchema>;

export const InstitutionalPolicyUpdateSchema = InstitutionalPolicyCreateSchema.partial();

// =====================================================================
// Admin Scopes DTOs
// =====================================================================
export const AdminScopeDtoSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  organizational_unit_id: z.string().uuid(),
  role: z.enum(["super_admin", "admin", "moderador"]),
  scope_level: z.enum(["global", "organizational_unit", "restricted"]),
  scoped_units: z.array(z.string()),
  permissions: z.array(z.string()),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type AdminScopeDto = z.infer<typeof AdminScopeDtoSchema>;

export const AdminScopeCreateSchema = z.object({
  user_id: z.string().uuid(),
  organizational_unit_id: z.string().uuid(),
  role: z.enum(["super_admin", "admin", "moderador"]),
  scope_level: z.enum(["global", "organizational_unit", "restricted"]),
  scoped_units: z.array(z.string()).optional(),
  permissions: z.array(z.string()).optional(),
});

export type AdminScopeCreate = z.infer<typeof AdminScopeCreateSchema>;

export const AdminScopeUpdateSchema = AdminScopeCreateSchema.partial();

// =====================================================================
// Global Configuration DTOs
// =====================================================================
export const GlobalConfigurationDtoSchema = z.object({
  id: z.string().uuid(),
  config_key: z.string(),
  config_value: z.record(z.unknown()),
  description: z.string().nullable(),
  is_secret: z.boolean(),
  is_mutable: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type GlobalConfigurationDto = z.infer<typeof GlobalConfigurationDtoSchema>;

export const GlobalConfigurationCreateSchema = z.object({
  config_key: z.string().regex(/^[a-z0-9_]+$/, "Config key must be lowercase alphanumeric with underscores"),
  config_value: z.record(z.unknown()),
  description: z.string().optional(),
  is_secret: z.boolean().optional(),
  is_mutable: z.boolean().optional(),
});

export type GlobalConfigurationCreate = z.infer<typeof GlobalConfigurationCreateSchema>;

export const GlobalConfigurationUpdateSchema = z.object({
  config_value: z.record(z.unknown()).optional(),
  description: z.string().optional(),
});

// =====================================================================
// Moderation Actions DTOs
// =====================================================================
export const ModerationActionDtoSchema = z.object({
  id: z.string().uuid(),
  actor_id: z.string().uuid(),
  action_type: z.enum(["user_suspend", "user_reactivate", "content_flag", "content_remove", "role_change", "policy_override", "custom"]),
  target_resource_type: z.string(),
  target_resource_id: z.string().uuid(),
  organizational_unit_id: z.string().uuid().nullable(),
  reason: z.string(),
  metadata: z.record(z.unknown()).nullable(),
  created_at: z.string(),
});

export type ModerationActionDto = z.infer<typeof ModerationActionDtoSchema>;

export const ModerationActionCreateSchema = z.object({
  action_type: z.enum(["user_suspend", "user_reactivate", "content_flag", "content_remove", "role_change", "policy_override", "custom"]),
  target_resource_type: z.string(),
  target_resource_id: z.string().uuid(),
  organizational_unit_id: z.string().uuid().optional(),
  reason: z.string().min(1),
  metadata: z.record(z.unknown()).optional(),
});

export type ModerationActionCreate = z.infer<typeof ModerationActionCreateSchema>;

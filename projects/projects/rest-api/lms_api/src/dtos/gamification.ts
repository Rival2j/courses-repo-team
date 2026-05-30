import { z } from "zod";

export const XpRuleDtoSchema = z.object({
  id: z.string().uuid(),
  action: z.string(),
  base_xp: z.number().int(),
  multiplier: z.string(),
  course_id: z.string().uuid().nullable(),
  is_active: z.boolean(),
  created_by: z.string().uuid().nullable(),
  created_at: z.string(),
});

export const XpRuleCreateSchema = z.object({
  action: z.enum([
    "lesson_complete",
    "module_complete",
    "course_complete",
    "evaluation_pass",
    "evaluation_perfect",
  ]),
  base_xp: z.number().int().min(1),
  multiplier: z.number().min(0.1).max(10).optional(),
  course_id: z.string().uuid().nullable().optional(),
  is_active: z.boolean().optional(),
});

export const XpRuleUpdateSchema = XpRuleCreateSchema.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: "Debe incluir al menos un campo para actualizar" },
);

export const LevelDtoSchema = z.object({
  id: z.string().uuid(),
  level_number: z.number().int(),
  title: z.string(),
  required_xp: z.number().int(),
  created_at: z.string(),
});

export const LevelCreateSchema = z.object({
  level_number: z.number().int().min(1),
  title: z.string().trim().min(1),
  required_xp: z.number().int().min(0),
});

export const LevelUpdateSchema = LevelCreateSchema.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: "Debe incluir al menos un campo para actualizar" },
);

export const BadgeDtoSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  icon_url: z.string().nullable(),
  criteria: z.unknown(),
  is_active: z.boolean(),
  created_at: z.string(),
});

export const BadgeCreateSchema = z.object({
  slug: z.string().trim().min(1),
  title: z.string().trim().min(1),
  description: z.string().nullable().optional(),
  icon_url: z.string().url().nullable().optional(),
  criteria: z.record(z.unknown()).optional(),
  is_active: z.boolean().optional(),
});

export const BadgeUpdateSchema = BadgeCreateSchema.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: "Debe incluir al menos un campo para actualizar" },
);

export const TrophyDtoSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  icon_url: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
});

export const TrophyCreateSchema = z.object({
  slug: z.string().trim().min(1),
  title: z.string().trim().min(1),
  description: z.string().nullable().optional(),
  icon_url: z.string().url().nullable().optional(),
  is_active: z.boolean().optional(),
});

export const TrophyUpdateSchema = TrophyCreateSchema.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: "Debe incluir al menos un campo para actualizar" },
);

export const XpOverrideDtoSchema = z.object({
  id: z.string().uuid(),
  xp_rule_id: z.string().uuid(),
  course_id: z.string().uuid().nullable(),
  override_xp: z.number().int(),
  created_by: z.string().uuid().nullable(),
  created_at: z.string(),
});

export const XpOverrideCreateSchema = z.object({
  xp_rule_id: z.string().uuid(),
  course_id: z.string().uuid().nullable().optional(),
  override_xp: z.number().int().min(0),
});

export const XpOverrideUpdateSchema = z.object({
  override_xp: z.number().int().min(0),
});

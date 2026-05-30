import { z } from "zod";

export const uuidSchema = z.string().uuid();
export const isoDateTimeSchema = z.string().datetime({ offset: true });
export const nonEmptyTextSchema = z.string().trim().min(1);

export function withObjectKeyAliases<TShape extends z.ZodRawShape>(
  shape: TShape,
  aliases: Record<string, string>,
) {
  return z.preprocess((input) => {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      return input;
    }

    const source = input as Record<string, unknown>;
    const normalized: Record<string, unknown> = { ...source };

    for (const [aliasKey, canonicalKey] of Object.entries(aliases)) {
      if (
        normalized[canonicalKey] === undefined &&
        source[aliasKey] !== undefined
      ) {
        normalized[canonicalKey] = source[aliasKey];
      }
    }

    return normalized;
  }, z.object(shape).strict());
}

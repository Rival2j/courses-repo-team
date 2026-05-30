import { createHmac, timingSafeEqual } from "node:crypto";
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { loadConfig } from "../config";

export type JwtClaims = Record<string, unknown> & {
  sub?: string;
  role?: string;
  app_metadata?: { role?: string };
  user_metadata?: { role?: string };
  exp?: number;
  nbf?: number;
};

const config = (() => {
  try {
    return loadConfig();
  } catch {
    return null;
  }
})();

const SUPABASE_URL = config?.SUPABASE_URL ?? process.env.SUPABASE_URL ?? null;
const JWKS = SUPABASE_URL
  ? createRemoteJWKSet(new URL(`${SUPABASE_URL}/auth/v1/.well-known/jwks.json`))
  : null;

/**
 * Verify a JWT token.
 *  - First attempt: verify using JWKS (Supabase issuer) if configured.
 *  - Fallback: if HS256 and a secret is provided, verify locally for dev/testing.
 */
export async function verifyJwt(
  token: string,
  secret?: string,
): Promise<JwtClaims> {
  // Try JWKS verification if available
  if (JWKS && SUPABASE_URL) {
    try {
      const { payload } = await jwtVerify(token, JWKS, {
        issuer: `${SUPABASE_URL}/auth/v1`,
      });
      return payload as JwtClaims;
    } catch (err) {
      // fall through to HS256 fallback if available
    }
  }

  // HS256 fallback for local testing
  if (!secret) {
    throw new Error("No verification method available for JWT");
  }

  // Manual HS256 verification (existing behavior)
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT format");

  const [headerSegment, payloadSegment, signatureSegment] = parts;
  const header = JSON.parse(
    Buffer.from(
      headerSegment.replace(/-/g, "+").replace(/_/g, "/"),
      "base64",
    ).toString("utf8"),
  ) as { alg?: string };

  if (header.alg !== "HS256") {
    throw new Error("Unsupported JWT algorithm for fallback");
  }

  const signingInput = `${headerSegment}.${payloadSegment}`;
  const expectedSignature = createHmac("sha256", secret)
    .update(signingInput)
    .digest();
  const receivedSignature = Buffer.from(
    signatureSegment.replace(/-/g, "+").replace(/_/g, "/"),
    "base64",
  );

  if (
    expectedSignature.length !== receivedSignature.length ||
    !timingSafeEqual(expectedSignature, receivedSignature)
  ) {
    throw new Error("Invalid JWT signature");
  }

  const claims = JSON.parse(
    Buffer.from(
      payloadSegment.replace(/-/g, "+").replace(/_/g, "/"),
      "base64",
    ).toString("utf8"),
  ) as JwtClaims;
  const now = Math.floor(Date.now() / 1000);

  if (typeof claims.nbf === "number" && claims.nbf > now)
    throw new Error("JWT not active yet");
  if (typeof claims.exp === "number" && claims.exp <= now)
    throw new Error("JWT expired");

  return claims;
}

export function signJwtForTesting(claims: JwtClaims, secret: string): string {
  const header = { alg: "HS256", typ: "JWT" };
  const headerSegment = Buffer.from(JSON.stringify(header), "utf8")
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  const payloadSegment = Buffer.from(JSON.stringify(claims), "utf8")
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  const signingInput = `${headerSegment}.${payloadSegment}`;
  const signatureSegment = createHmac("sha256", secret)
    .update(signingInput)
    .digest()
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `${signingInput}.${signatureSegment}`;
}

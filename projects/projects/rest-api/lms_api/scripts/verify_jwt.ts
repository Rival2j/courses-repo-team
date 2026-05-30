import { signJwtForTesting, verifyJwt } from "../src/lib/jwt";

async function main(): Promise<void> {
  const secret = process.env.JWT_SECRET ?? "test-secret";
  const token = signJwtForTesting(
    {
      sub: "11111111-1111-1111-1111-111111111111",
      role: "alumno",
      email: "juan.perez@example.com",
      exp: Math.floor(Date.now() / 1000) + 3600,
    },
    secret,
  );

  console.log(token);
  const claims = await verifyJwt(token, secret);
  console.log(JSON.stringify(claims, null, 2));
}

void main();

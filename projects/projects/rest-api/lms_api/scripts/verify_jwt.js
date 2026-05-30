"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../src/lib/jwt");
async function main() {
    const secret = process.env.JWT_SECRET ?? "test-secret";
    const token = (0, jwt_1.signJwtForTesting)({
        sub: "11111111-1111-1111-1111-111111111111",
        role: "alumno",
        email: "juan.perez@example.com",
        exp: Math.floor(Date.now() / 1000) + 3600,
    }, secret);
    console.log(token);
    const claims = await (0, jwt_1.verifyJwt)(token, secret);
    console.log(JSON.stringify(claims, null, 2));
}
void main();

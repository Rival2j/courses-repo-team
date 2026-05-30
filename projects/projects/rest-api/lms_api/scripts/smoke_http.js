"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../src/lib/jwt");
async function request(name, input, init) {
    const response = await fetch(input, init);
    const text = await response.text();
    let body = text;
    try {
        body = JSON.parse(text);
    }
    catch {
        body = text;
    }
    return { name, status: response.status, body };
}
async function main() {
    const secret = process.env.JWT_SECRET ?? "test-secret";
    const port = process.env.PORT ?? "3000";
    const baseUrl = `http://localhost:${port}`;
    const userJwt = (0, jwt_1.signJwtForTesting)({
        sub: "11111111-1111-1111-1111-111111111111",
        role: "alumno",
        email: "juan.perez@example.com",
        exp: Math.floor(Date.now() / 1000) + 3600,
    }, secret);
    const adminJwt = (0, jwt_1.signJwtForTesting)({
        sub: "11111111-1111-1111-1111-111114111111",
        role: "admin",
        email: "admin@example.com",
        exp: Math.floor(Date.now() / 1000) + 3600,
    }, secret);
    const results = [];
    results.push(await request("GET /health", `${baseUrl}/health`, { method: "GET" }));
    results.push(await request("POST /users/bootstrap", `${baseUrl}/users/bootstrap`, {
        method: "POST",
        headers: {
            authorization: `Bearer ${userJwt}`,
            "content-type": "application/json",
        },
        body: JSON.stringify({
            display_name: "Juan Pérez",
        }),
    }));
    results.push(await request("GET /users/me", `${baseUrl}/users/me`, {
        headers: { authorization: `Bearer ${userJwt}` },
    }));
    results.push(await request("GET /users/emails?role=alumno&format=csv", `${baseUrl}/users/emails?role=alumno&format=csv`, { headers: { authorization: `Bearer ${adminJwt}` } }));
    results.push(await request("GET /users", `${baseUrl}/users`, {
        headers: { authorization: `Bearer ${adminJwt}` },
    }));
    results.push(await request("POST /users/:id/provision", `${baseUrl}/users/11111111-1111-1111-1111-111111111111/provision`, {
        method: "POST",
        headers: {
            authorization: `Bearer ${adminJwt}`,
            "content-type": "application/json",
        },
        body: JSON.stringify({
            role: "moderador",
            email: "juan.perez@example.com",
            display_name: "Juan Pérez",
        }),
    }));
    results.push(await request("GET /users/:id", `${baseUrl}/users/11111111-1111-1111-1111-111111111111`, { headers: { authorization: `Bearer ${adminJwt}` } }));
    results.push(await request("PATCH /users/:id", `${baseUrl}/users/11111111-1111-1111-1111-111111111111`, {
        method: "PATCH",
        headers: {
            authorization: `Bearer ${adminJwt}`,
            "content-type": "application/json",
        },
        body: JSON.stringify({ display_name: "Juan P. Renovado" }),
    }));
    for (const result of results) {
        console.log(`\n== ${result.name} ==`);
        console.log(`status=${result.status}`);
        console.log(JSON.stringify(result.body, null, 2));
    }
}
void main();

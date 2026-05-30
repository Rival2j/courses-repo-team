"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userProfiles_1 = require("../src/lib/userProfiles");
async function main() {
    try {
        const result = await (0, userProfiles_1.provisionUserRole)({
            actorUserId: "22222222-2222-2222-2222-222222222222",
            userId: "11111111-1111-1111-1111-111111111111",
            email: "juan.perez@example.com",
            displayName: "Juan Pérez",
            role: "moderador",
        });
        console.log(JSON.stringify(result, null, 2));
    }
    catch (error) {
        console.error(error);
        process.exitCode = 1;
    }
}
void main();

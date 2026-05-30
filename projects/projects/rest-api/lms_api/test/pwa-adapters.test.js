"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const strict_1 = __importDefault(require("node:assert/strict"));
const node_crypto_1 = require("node:crypto");
const node_test_1 = __importDefault(require("node:test"));
const postgres_1 = __importDefault(require("postgres"));
const database_1 = require("../src/lib/database");
function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} is required for PWA adapter tests`);
    }
    return value;
}
const connectionString = requireEnv("SUPABASE_CONNECTION_STRING");
const jwtSecret = requireEnv("JWT_SECRET");
function createClient() {
    return (0, postgres_1.default)(connectionString, { prepare: false, max: 1 });
}
(0, node_test_1.default)("T910 /pwa/courses - should return courses in PWA format", async () => {
    const sql = createClient();
    try {
        const courseId = (0, node_crypto_1.randomUUID)();
        const courseSlug = `test-${courseId}`;
        const profileId = (0, node_crypto_1.randomUUID)();
        await sql `
      INSERT INTO cursos.profiles (id, display_name, email, role)
      VALUES (${profileId}, ${"Test Instructor"}, ${`${profileId}@test.local`}, ${"instructor"})
    `;
        await sql `
      INSERT INTO cursos.courses (id, slug, title, description, created_by)
      VALUES (
        ${courseId},
        ${courseSlug},
        ${"Test Course"},
        ${"Test Description"},
        ${profileId}
      )
    `;
        const response = await fetch("http://localhost:3000/pwa/courses", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        strict_1.default.strictEqual(response.status, 200, "should return 200 OK");
        const body = await response.json();
        (0, strict_1.default)(Array.isArray(body.data), "response.data should be an array");
        if (body.data.length > 0) {
            const course = body.data[0];
            (0, strict_1.default)(course.id, "course should have id");
            (0, strict_1.default)(course.title, "course should have title");
            (0, strict_1.default)(course.summary !== undefined, "course should have summary");
            (0, strict_1.default)(course.instructor, "course should have instructor");
            (0, strict_1.default)(course.difficulty, "course should have difficulty");
            (0, strict_1.default)(Array.isArray(course.prerequisiteCourseIds), "course.prerequisiteCourseIds should be array");
            (0, strict_1.default)(course.rating !== undefined, "course should have rating");
            (0, strict_1.default)(typeof course.reviewCount === "number", "course.reviewCount should be number");
            (0, strict_1.default)(course.durationHours !== undefined, "course should have durationHours");
            (0, strict_1.default)(typeof course.lessonsCount === "number", "course.lessonsCount should be number");
            (0, strict_1.default)(course.language, "course should have language");
            (0, strict_1.default)(course.category, "course should have category");
            (0, strict_1.default)(course.level, "course should have level");
            (0, strict_1.default)(Array.isArray(course.modules), "course.modules should be array");
        }
    }
    finally {
        await sql.end({ timeout: 5 });
        (0, database_1.closeDatabaseClient)();
    }
});
(0, node_test_1.default)("T911 /pwa/courses/:courseId - should return single course with modules", async () => {
    const sql = createClient();
    try {
        const courseId = (0, node_crypto_1.randomUUID)();
        const courseSlug = `test-${courseId}`;
        const profileId = (0, node_crypto_1.randomUUID)();
        const moduleId = (0, node_crypto_1.randomUUID)();
        const lessonId = (0, node_crypto_1.randomUUID)();
        await sql `
      INSERT INTO cursos.profiles (id, display_name, email, role)
      VALUES (${profileId}, ${"Test Instructor"}, ${`${profileId}@test.local`}, ${"instructor"})
    `;
        await sql `
      INSERT INTO cursos.courses (id, slug, title, description, created_by)
      VALUES (
        ${courseId},
        ${courseSlug},
        ${"Single Course"},
        ${"Course with modules"},
        ${profileId}
      )
    `;
        await sql `
      INSERT INTO cursos.modules (id, course_id, title, position)
      VALUES (${moduleId}, ${courseId}, ${"Test Module"}, 1)
    `;
        await sql `
      INSERT INTO cursos.lessons (id, module_id, title, content, position)
      VALUES (${lessonId}, ${moduleId}, ${"Test Lesson"}, ${"Lesson content"}, 1)
    `;
        const response = await fetch(`http://localhost:3000/pwa/courses/${courseId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        strict_1.default.strictEqual(response.status, 200, "should return 200 OK");
        const body = await response.json();
        const course = body.data;
        strict_1.default.strictEqual(course.id, courseId, "course id should match");
        strict_1.default.strictEqual(course.title, "Single Course", "course title should match");
        (0, strict_1.default)(Array.isArray(course.modules), "course.modules should be array");
        (0, strict_1.default)(course.modules.length > 0, "should have at least one module");
        const module = course.modules[0];
        (0, strict_1.default)(module.id, "module should have id");
        (0, strict_1.default)(module.title, "module should have title");
        (0, strict_1.default)(Array.isArray(module.lessons), "module.lessons should be array");
        if (module.lessons.length > 0) {
            const lesson = module.lessons[0];
            (0, strict_1.default)(lesson.id, "lesson should have id");
            (0, strict_1.default)(lesson.title, "lesson should have title");
            (0, strict_1.default)(lesson.description !== undefined, "lesson should have description");
            (0, strict_1.default)(Array.isArray(lesson.resources), "lesson.resources should be array");
            (0, strict_1.default)(Array.isArray(lesson.blockedBy), "lesson.blockedBy should be array");
        }
    }
    finally {
        await sql.end({ timeout: 5 });
        (0, database_1.closeDatabaseClient)();
    }
});
(0, node_test_1.default)("T911 /pwa/courses/:courseId/related - should return related courses", async () => {
    const sql = createClient();
    try {
        const courseId = (0, node_crypto_1.randomUUID)();
        await sql `
      INSERT INTO cursos.courses (id, slug, title, description)
      VALUES (
        ${courseId},
        ${"related-test-" + courseId},
        ${"Course for related test"},
        ${"Test"}
      )
    `;
        const response = await fetch(`http://localhost:3000/pwa/courses/${courseId}/related`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        strict_1.default.strictEqual(response.status, 200, "should return 200 OK");
        const body = await response.json();
        (0, strict_1.default)(Array.isArray(body.data), "response.data should be an array");
    }
    finally {
        await sql.end({ timeout: 5 });
        (0, database_1.closeDatabaseClient)();
    }
});
(0, node_test_1.default)("T911 /pwa/users/:userId/profile - should return user profile", async () => {
    const sql = createClient();
    try {
        const profileId = (0, node_crypto_1.randomUUID)();
        const email = `${profileId}@test.local`;
        const displayName = "Test User";
        await sql `
      INSERT INTO cursos.profiles (id, display_name, email, role, avatar_url, bio)
      VALUES (
        ${profileId},
        ${displayName},
        ${email},
        ${"alumno"},
        ${"https://example.com/avatar.jpg"},
        ${"Test bio"}
      )
    `;
        const response = await fetch(`http://localhost:3000/pwa/users/${profileId}/profile`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        strict_1.default.strictEqual(response.status, 200, "should return 200 OK");
        const body = await response.json();
        const profile = body.data;
        strict_1.default.strictEqual(profile.id, profileId, "profile id should match");
        strict_1.default.strictEqual(profile.display_name, displayName, "display_name should match");
        strict_1.default.strictEqual(profile.email, email, "email should match");
    }
    finally {
        await sql.end({ timeout: 5 });
        (0, database_1.closeDatabaseClient)();
    }
});

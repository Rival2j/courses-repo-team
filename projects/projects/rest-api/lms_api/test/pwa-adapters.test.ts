import "dotenv/config";

import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import postgres from "postgres";

import { app } from "../src/index";
import { closeDatabaseClient } from "../src/lib/database";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required for PWA adapter tests`);
  }
  return value;
}

const connectionString = requireEnv("SUPABASE_CONNECTION_STRING");
const jwtSecret = requireEnv("JWT_SECRET");

type DatabaseClient = ReturnType<typeof postgres>;

function createClient(): DatabaseClient {
  return postgres(connectionString, { prepare: false, max: 1 });
}

test("T910 /pwa/courses - should return courses in PWA format", async () => {
  const sql = createClient();

  try {
    const courseId = randomUUID();
    const courseSlug = `test-${courseId}`;
    const profileId = randomUUID();

    await sql`
      INSERT INTO cursos.profiles (id, display_name, email, role)
      VALUES (${profileId}, ${"Test Instructor"}, ${`${profileId}@test.local`}, ${"instructor"})
    `;

    await sql`
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

    assert.strictEqual(response.status, 200, "should return 200 OK");

    const body = await response.json();
    assert(Array.isArray(body.data), "response.data should be an array");

    if (body.data.length > 0) {
      const course = body.data[0];
      assert(course.id, "course should have id");
      assert(course.title, "course should have title");
      assert(course.summary !== undefined, "course should have summary");
      assert(course.instructor, "course should have instructor");
      assert(course.difficulty, "course should have difficulty");
      assert(Array.isArray(course.prerequisiteCourseIds), "course.prerequisiteCourseIds should be array");
      assert(course.rating !== undefined, "course should have rating");
      assert(typeof course.reviewCount === "number", "course.reviewCount should be number");
      assert(course.durationHours !== undefined, "course should have durationHours");
      assert(typeof course.lessonsCount === "number", "course.lessonsCount should be number");
      assert(course.language, "course should have language");
      assert(course.category, "course should have category");
      assert(course.level, "course should have level");
      assert(Array.isArray(course.modules), "course.modules should be array");
    }
  } finally {
    await sql.end({ timeout: 5 });
    closeDatabaseClient();
  }
});

test("T911 /pwa/courses/:courseId - should return single course with modules", async () => {
  const sql = createClient();

  try {
    const courseId = randomUUID();
    const courseSlug = `test-${courseId}`;
    const profileId = randomUUID();
    const moduleId = randomUUID();
    const lessonId = randomUUID();

    await sql`
      INSERT INTO cursos.profiles (id, display_name, email, role)
      VALUES (${profileId}, ${"Test Instructor"}, ${`${profileId}@test.local`}, ${"instructor"})
    `;

    await sql`
      INSERT INTO cursos.courses (id, slug, title, description, created_by)
      VALUES (
        ${courseId},
        ${courseSlug},
        ${"Single Course"},
        ${"Course with modules"},
        ${profileId}
      )
    `;

    await sql`
      INSERT INTO cursos.modules (id, course_id, title, position)
      VALUES (${moduleId}, ${courseId}, ${"Test Module"}, 1)
    `;

    await sql`
      INSERT INTO cursos.lessons (id, module_id, title, content, position)
      VALUES (${lessonId}, ${moduleId}, ${"Test Lesson"}, ${"Lesson content"}, 1)
    `;

    const response = await fetch(`http://localhost:3000/pwa/courses/${courseId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    assert.strictEqual(response.status, 200, "should return 200 OK");

    const body = await response.json();
    const course = body.data;

    assert.strictEqual(course.id, courseId, "course id should match");
    assert.strictEqual(course.title, "Single Course", "course title should match");
    assert(Array.isArray(course.modules), "course.modules should be array");
    assert(course.modules.length > 0, "should have at least one module");

    const module = course.modules[0];
    assert(module.id, "module should have id");
    assert(module.title, "module should have title");
    assert(Array.isArray(module.lessons), "module.lessons should be array");

    if (module.lessons.length > 0) {
      const lesson = module.lessons[0];
      assert(lesson.id, "lesson should have id");
      assert(lesson.title, "lesson should have title");
      assert(lesson.description !== undefined, "lesson should have description");
      assert(Array.isArray(lesson.resources), "lesson.resources should be array");
      assert(Array.isArray(lesson.blockedBy), "lesson.blockedBy should be array");
    }
  } finally {
    await sql.end({ timeout: 5 });
    closeDatabaseClient();
  }
});

test("T911 /pwa/courses/:courseId/related - should return related courses", async () => {
  const sql = createClient();

  try {
    const courseId = randomUUID();

    await sql`
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

    assert.strictEqual(response.status, 200, "should return 200 OK");

    const body = await response.json();
    assert(Array.isArray(body.data), "response.data should be an array");
  } finally {
    await sql.end({ timeout: 5 });
    closeDatabaseClient();
  }
});

test("T911 /pwa/users/:userId/profile - should return user profile", async () => {
  const sql = createClient();

  try {
    const profileId = randomUUID();
    const email = `${profileId}@test.local`;
    const displayName = "Test User";

    await sql`
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

    assert.strictEqual(response.status, 200, "should return 200 OK");

    const body = await response.json();
    const profile = body.data;

    assert.strictEqual(profile.id, profileId, "profile id should match");
    assert.strictEqual(profile.display_name, displayName, "display_name should match");
    assert.strictEqual(profile.email, email, "email should match");
  } finally {
    await sql.end({ timeout: 5 });
    closeDatabaseClient();
  }
});

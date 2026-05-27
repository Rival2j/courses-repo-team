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
const learningPaths_1 = require("../src/lib/learningPaths");
const database_1 = require("../src/lib/database");
const connectionString = process.env.SUPABASE_CONNECTION_STRING;
if (!connectionString) {
    throw new Error("SUPABASE_CONNECTION_STRING is required for integration tests");
}
function createClient() {
    return (0, postgres_1.default)(connectionString, { prepare: false });
}
async function createProfile(sql, role) {
    const profileId = (0, node_crypto_1.randomUUID)();
    const email = `${profileId}@integration.test`;
    await sql `
    insert into cursos.profiles (id, display_name, email, role)
    values (${profileId}, ${`Integration ${role}`}, ${email}, ${role})
  `;
    return { id: profileId, email };
}
async function createCourse(sql, slugPrefix) {
    const courseId = (0, node_crypto_1.randomUUID)();
    const slug = `${slugPrefix}-${courseId}`;
    await sql `
    insert into cursos.courses (id, slug, title, description)
    values (${courseId}, ${slug}, ${`${slugPrefix} course`}, ${null})
  `;
    return { id: courseId, slug };
}
async function createCourseCompletion(sql, userId, slugPrefix, completed) {
    const course = await createCourse(sql, slugPrefix);
    const moduleId = (0, node_crypto_1.randomUUID)();
    const lessonId = (0, node_crypto_1.randomUUID)();
    const enrollmentId = (0, node_crypto_1.randomUUID)();
    await sql `
    insert into cursos.modules (id, course_id, title, position)
    values (${moduleId}, ${course.id}, ${`${slugPrefix} module`}, 1)
  `;
    await sql `
    insert into cursos.lessons (id, module_id, title, content, position)
    values (${lessonId}, ${moduleId}, ${`${slugPrefix} lesson`}, ${null}, 1)
  `;
    await sql `
    insert into cursos.enrollments (id, user_id, course_id, status)
    values (${enrollmentId}, ${userId}, ${course.id}, 'active')
  `;
    if (completed) {
        await sql `
      insert into cursos.progress (id, enrollment_id, lesson_id, completed, completed_at)
      values (${(0, node_crypto_1.randomUUID)()}, ${enrollmentId}, ${lessonId}, true, now())
    `;
    }
    return { courseId: course.id, enrollmentId, lessonId };
}
async function cleanupByIds(sql, ids) {
    const courseIds = ids.courseIds ?? [];
    const enrollmentIds = ids.enrollmentIds ?? [];
    const moduleIds = ids.moduleIds ?? [];
    const lessonIds = ids.lessonIds ?? [];
    const profileIds = ids.profileIds ?? [];
    if (lessonIds.length > 0) {
        await sql `delete from cursos.progress where lesson_id = any(${lessonIds})`;
        await sql `delete from cursos.lessons where id = any(${lessonIds})`;
    }
    if (moduleIds.length > 0) {
        await sql `delete from cursos.modules where id = any(${moduleIds})`;
    }
    if (enrollmentIds.length > 0) {
        await sql `delete from cursos.enrollments where id = any(${enrollmentIds})`;
    }
    if (ids.learningPathId && courseIds.length > 0) {
        await sql `
      delete from cursos.learning_path_courses
      where learning_path_id = ${ids.learningPathId}
        and course_id = any(${courseIds})
    `;
    }
    if (ids.learningPathId) {
        await sql `delete from cursos.learning_paths where id = ${ids.learningPathId}`;
    }
    if (courseIds.length > 0) {
        await sql `delete from cursos.course_prerequisites where course_id = any(${courseIds}) or prerequisite_course_id = any(${courseIds})`;
        await sql `delete from cursos.courses where id = any(${courseIds})`;
    }
    if (profileIds.length > 0) {
        await sql `delete from cursos.profiles where id = any(${profileIds})`;
    }
}
node_test_1.default.after(async () => {
    await (0, database_1.closeDatabaseClient)();
});
(0, node_test_1.default)("Supabase connection exposes cursos schema and can_enroll RPC", async () => {
    const sql = createClient();
    try {
        const rows = await sql `
      select
        current_schema() as current_schema,
        to_regprocedure('cursos.can_enroll(uuid, uuid)') as rpc_name
    `;
        strict_1.default.equal(rows[0]?.current_schema, "cursos");
        strict_1.default.equal(rows[0]?.rpc_name, "can_enroll(uuid,uuid)");
    }
    finally {
        await sql.end({ timeout: 5 });
    }
});
(0, node_test_1.default)("learning paths CRUD persists associations end to end", async () => {
    const sql = createClient();
    const profile = await createProfile(sql, "admin");
    const createdCourse = await createCourse(sql, "learning-path-course");
    try {
        const path = await (0, learningPaths_1.createLearningPath)({
            slug: `lp-${profile.id}`,
            title: "Learning Path Integration",
            description: "Integration test",
            isActive: true,
        }, profile.id);
        const association = await (0, learningPaths_1.addCourseToLearningPath)(path.id, createdCourse.id, {
            position: 1,
            isRequired: true,
        });
        const detail = await (0, learningPaths_1.getLearningPathById)(path.id);
        strict_1.default.ok(detail);
        strict_1.default.equal(detail.learning_path.slug, path.slug);
        strict_1.default.equal(detail.courses.length, 1);
        strict_1.default.equal(detail.courses[0]?.course_id, createdCourse.id);
        strict_1.default.equal(association.learning_path_id, path.id);
        const updatedPath = await (0, learningPaths_1.updateLearningPath)(path.id, {
            title: "Learning Path Integration Updated",
        });
        strict_1.default.ok(updatedPath);
        strict_1.default.equal(updatedPath.title, "Learning Path Integration Updated");
        const updatedAssociation = await (0, learningPaths_1.updateLearningPathCourse)(path.id, createdCourse.id, {
            position: 2,
            isRequired: false,
        });
        strict_1.default.ok(updatedAssociation);
        strict_1.default.equal(updatedAssociation.position, 2);
        strict_1.default.equal(updatedAssociation.is_required, false);
        const removed = await (0, learningPaths_1.removeCourseFromLearningPath)(path.id, createdCourse.id);
        strict_1.default.equal(removed, true);
        const deleted = await (0, learningPaths_1.deleteLearningPath)(path.id);
        strict_1.default.equal(deleted, true);
    }
    finally {
        await cleanupByIds(sql, {
            courseIds: [createdCourse.id],
            profileIds: [profile.id],
        });
        await sql.end({ timeout: 5 });
    }
});
(0, node_test_1.default)("can_enroll returns eligible and blocked states", async () => {
    const sql = createClient();
    const profile = await createProfile(sql, "alumno");
    const completedPrerequisite = await createCourseCompletion(sql, profile.id, "prereq-complete", true);
    const incompletePrerequisite = await createCourseCompletion(sql, profile.id, "prereq-incomplete", false);
    const eligibleTarget = await createCourse(sql, "target-eligible");
    const blockedTarget = await createCourse(sql, "target-blocked");
    try {
        await sql `
      insert into cursos.course_prerequisites (course_id, prerequisite_course_id)
      values (${eligibleTarget.id}, ${completedPrerequisite.courseId})
    `;
        const eligible = await (0, learningPaths_1.resolveCanEnroll)(profile.id, eligibleTarget.id);
        strict_1.default.equal(eligible.user_id, profile.id);
        strict_1.default.equal(eligible.course_id, eligibleTarget.id);
        strict_1.default.equal(eligible.can_enroll, true);
        strict_1.default.equal(eligible.reason, "eligible");
        strict_1.default.equal(eligible.enrollment_id, null);
        strict_1.default.deepEqual(eligible.pending_prerequisite_course_ids, []);
        await sql `
      insert into cursos.course_prerequisites (course_id, prerequisite_course_id)
      values (${blockedTarget.id}, ${incompletePrerequisite.courseId})
    `;
        const blocked = await (0, learningPaths_1.resolveCanEnroll)(profile.id, blockedTarget.id);
        strict_1.default.equal(blocked.user_id, profile.id);
        strict_1.default.equal(blocked.course_id, blockedTarget.id);
        strict_1.default.equal(blocked.can_enroll, false);
        strict_1.default.equal(blocked.reason, "prerequisites_incomplete");
        strict_1.default.deepEqual(blocked.pending_prerequisite_course_ids, [incompletePrerequisite.courseId]);
        await sql `
      insert into cursos.enrollments (id, user_id, course_id, status)
      values (${(0, node_crypto_1.randomUUID)()}, ${profile.id}, ${eligibleTarget.id}, 'active')
    `;
        const alreadyEnrolled = await (0, learningPaths_1.resolveCanEnroll)(profile.id, eligibleTarget.id);
        strict_1.default.equal(alreadyEnrolled.can_enroll, false);
        strict_1.default.equal(alreadyEnrolled.reason, "already_enrolled");
    }
    finally {
        await cleanupByIds(sql, {
            courseIds: [
                completedPrerequisite.courseId,
                incompletePrerequisite.courseId,
                eligibleTarget.id,
                blockedTarget.id,
            ],
            enrollmentIds: [completedPrerequisite.enrollmentId, incompletePrerequisite.enrollmentId],
            lessonIds: [completedPrerequisite.lessonId, incompletePrerequisite.lessonId],
            profileIds: [profile.id],
        });
        await sql.end({ timeout: 5 });
    }
});

import "dotenv/config";

import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import postgres from "postgres";

import {
  addCourseToLearningPath,
  createLearningPath,
  deleteLearningPath,
  getLearningPathById,
  removeCourseFromLearningPath,
  resolveCanEnroll,
  updateLearningPath,
  updateLearningPathCourse,
} from "../src/lib/learningPaths";
import { closeDatabaseClient } from "../src/lib/database";

const connectionString = process.env.SUPABASE_CONNECTION_STRING;

if (!connectionString) {
  throw new Error("SUPABASE_CONNECTION_STRING is required for integration tests");
}

type DatabaseClient = ReturnType<typeof postgres>;

function createClient(): DatabaseClient {
  return postgres(connectionString, { prepare: false });
}

test.before(async () => {
  const sql = createClient();
  try {
    // Ensure prerequisite-cycle prevention function and trigger exist (idempotent)
    await sql`
      CREATE OR REPLACE FUNCTION cursos.prevent_prerequisite_cycle()
      RETURNS trigger
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE found boolean; BEGIN
        IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
        SELECT EXISTS (
          WITH RECURSIVE search(n) AS (
            SELECT NEW.prerequisite_course_id
            UNION
            SELECT cp.prerequisite_course_id FROM cursos.course_prerequisites cp JOIN search s ON cp.course_id = s.n
          ) SELECT 1 FROM search WHERE n = NEW.course_id
        ) INTO found;
        IF found THEN RAISE EXCEPTION 'inserting prerequisite % -> % would create a cycle', NEW.course_id, NEW.prerequisite_course_id; END IF;
        RETURN NEW; END; $$;
    `;
    await sql`DROP TRIGGER IF EXISTS trg_prevent_prerequisite_cycle ON cursos.course_prerequisites`;
    await sql`CREATE TRIGGER trg_prevent_prerequisite_cycle BEFORE INSERT OR UPDATE ON cursos.course_prerequisites FOR EACH ROW EXECUTE FUNCTION cursos.prevent_prerequisite_cycle()`;

    // Ensure sequential progress enforcement exists
    await sql`
      CREATE OR REPLACE FUNCTION cursos.enforce_sequential_progress()
      RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$ DECLARE prev_lesson_id uuid; prev_completed boolean; BEGIN
        IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
        IF COALESCE(NEW.completed, false) = false THEN RETURN NEW; END IF;
        SELECT l_prev.id INTO prev_lesson_id FROM cursos.lessons l_curr JOIN cursos.lessons l_prev ON l_prev.module_id = l_curr.module_id AND l_prev.position < l_curr.position WHERE l_curr.id = NEW.lesson_id ORDER BY l_prev.position DESC LIMIT 1;
        IF prev_lesson_id IS NULL THEN RETURN NEW; END IF;
        SELECT COALESCE(p.completed, false) INTO prev_completed FROM cursos.progress p WHERE p.lesson_id = prev_lesson_id AND p.enrollment_id = NEW.enrollment_id LIMIT 1;
        IF prev_completed IS NOT TRUE THEN RAISE EXCEPTION 'cannot complete lesson % before completing previous lesson %', NEW.lesson_id, prev_lesson_id; END IF;
        RETURN NEW; END; $$;
    `;
    await sql`DROP TRIGGER IF EXISTS trg_enforce_sequential_progress ON cursos.progress`;
    await sql`CREATE TRIGGER trg_enforce_sequential_progress BEFORE INSERT OR UPDATE ON cursos.progress FOR EACH ROW EXECUTE FUNCTION cursos.enforce_sequential_progress()`;
  } finally {
    await sql.end({ timeout: 5 });
  }
});

async function createProfile(sql: DatabaseClient, role: string) {
  const profileId = randomUUID();
  const email = `${profileId}@integration.test`;

  await sql`
    insert into cursos.profiles (id, display_name, email, role)
    values (${profileId}, ${`Integration ${role}`}, ${email}, ${role})
  `;

  return { id: profileId, email };
}

async function createCourse(sql: DatabaseClient, slugPrefix: string) {
  const courseId = randomUUID();
  const slug = `${slugPrefix}-${courseId}`;

  await sql`
    insert into cursos.courses (id, slug, title, description)
    values (${courseId}, ${slug}, ${`${slugPrefix} course`}, ${null})
  `;

  return { id: courseId, slug };
}

async function createCourseCompletion(
  sql: DatabaseClient,
  userId: string,
  slugPrefix: string,
  completed: boolean,
) {
  const course = await createCourse(sql, slugPrefix);
  const moduleId = randomUUID();
  const lessonId = randomUUID();
  const enrollmentId = randomUUID();

  await sql`
    insert into cursos.modules (id, course_id, title, position)
    values (${moduleId}, ${course.id}, ${`${slugPrefix} module`}, 1)
  `;

  await sql`
    insert into cursos.lessons (id, module_id, title, content, position)
    values (${lessonId}, ${moduleId}, ${`${slugPrefix} lesson`}, ${null}, 1)
  `;

  await sql`
    insert into cursos.enrollments (id, user_id, course_id, status)
    values (${enrollmentId}, ${userId}, ${course.id}, 'active')
  `;

  if (completed) {
    await sql`
      insert into cursos.progress (id, enrollment_id, lesson_id, completed, completed_at)
      values (${randomUUID()}, ${enrollmentId}, ${lessonId}, true, now())
    `;
  }

  return { courseId: course.id, enrollmentId, lessonId };
}

async function cleanupByIds(
  sql: DatabaseClient,
  ids: {
    learningPathId?: string;
    courseIds?: string[];
    enrollmentIds?: string[];
    moduleIds?: string[];
    lessonIds?: string[];
    profileIds?: string[];
  },
) {
  const courseIds = ids.courseIds ?? [];
  const enrollmentIds = ids.enrollmentIds ?? [];
  const moduleIds = ids.moduleIds ?? [];
  const lessonIds = ids.lessonIds ?? [];
  const profileIds = ids.profileIds ?? [];

  if (lessonIds.length > 0) {
    await sql`delete from cursos.progress where lesson_id = any(${lessonIds})`;
    await sql`delete from cursos.lessons where id = any(${lessonIds})`;
  }

  if (moduleIds.length > 0) {
    await sql`delete from cursos.modules where id = any(${moduleIds})`;
  }

  if (enrollmentIds.length > 0) {
    await sql`delete from cursos.enrollments where id = any(${enrollmentIds})`;
  }

  if (ids.learningPathId && courseIds.length > 0) {
    await sql`
      delete from cursos.learning_path_courses
      where learning_path_id = ${ids.learningPathId}
        and course_id = any(${courseIds})
    `;
  }

  if (ids.learningPathId) {
    await sql`delete from cursos.learning_paths where id = ${ids.learningPathId}`;
  }

  if (courseIds.length > 0) {
    await sql`delete from cursos.course_prerequisites where course_id = any(${courseIds}) or prerequisite_course_id = any(${courseIds})`;
    await sql`delete from cursos.courses where id = any(${courseIds})`;
  }

  if (profileIds.length > 0) {
    await sql`delete from cursos.profiles where id = any(${profileIds})`;
  }
}

test.after(async () => {
  await closeDatabaseClient();
});

test("Supabase connection exposes cursos schema and can_enroll RPC", async () => {
  const sql = createClient();

  try {
    const rows = await sql`
      select
        current_schema() as current_schema,
        to_regprocedure('cursos.can_enroll(uuid, uuid)') as rpc_name
    `;

    assert.equal(rows[0]?.current_schema, "cursos");
    assert.equal(rows[0]?.rpc_name, "can_enroll(uuid,uuid)");
  } finally {
    await sql.end({ timeout: 5 });
  }
});

test("learning paths CRUD persists associations end to end", async () => {
  const sql = createClient();
  const profile = await createProfile(sql, "admin");
  const createdCourse = await createCourse(sql, "learning-path-course");

  try {
    const path = await createLearningPath(
      {
        slug: `lp-${profile.id}`,
        title: "Learning Path Integration",
        description: "Integration test",
        isActive: true,
      },
      profile.id,
    );

    const association = await addCourseToLearningPath(path.id, createdCourse.id, {
      position: 1,
      isRequired: true,
    });

    const detail = await getLearningPathById(path.id);

    assert.ok(detail);
    assert.equal(detail.learning_path.slug, path.slug);
    assert.equal(detail.courses.length, 1);
    assert.equal(detail.courses[0]?.course_id, createdCourse.id);
    assert.equal(association.learning_path_id, path.id);

    const updatedPath = await updateLearningPath(path.id, {
      title: "Learning Path Integration Updated",
    });
    assert.ok(updatedPath);
    assert.equal(updatedPath.title, "Learning Path Integration Updated");

    const updatedAssociation = await updateLearningPathCourse(path.id, createdCourse.id, {
      position: 2,
      isRequired: false,
    });

    assert.ok(updatedAssociation);
    assert.equal(updatedAssociation.position, 2);
    assert.equal(updatedAssociation.is_required, false);

    const removed = await removeCourseFromLearningPath(path.id, createdCourse.id);
    assert.equal(removed, true);

    const deleted = await deleteLearningPath(path.id);
    assert.equal(deleted, true);
  } finally {
    await cleanupByIds(sql, {
      courseIds: [createdCourse.id],
      profileIds: [profile.id],
    });
    await sql.end({ timeout: 5 });
  }
});

test("can_enroll returns eligible and blocked states", async () => {
  const sql = createClient();
  const profile = await createProfile(sql, "alumno");
  const completedPrerequisite = await createCourseCompletion(
    sql,
    profile.id,
    "prereq-complete",
    true,
  );
  const incompletePrerequisite = await createCourseCompletion(
    sql,
    profile.id,
    "prereq-incomplete",
    false,
  );
  const eligibleTarget = await createCourse(sql, "target-eligible");
  const blockedTarget = await createCourse(sql, "target-blocked");

  try {
    await sql`
      insert into cursos.course_prerequisites (course_id, prerequisite_course_id)
      values (${eligibleTarget.id}, ${completedPrerequisite.courseId})
    `;

    const eligible = await resolveCanEnroll(profile.id, eligibleTarget.id);
    assert.equal(eligible.user_id, profile.id);
    assert.equal(eligible.course_id, eligibleTarget.id);
    assert.equal(eligible.can_enroll, true);
    assert.equal(eligible.reason, "eligible");
    assert.equal(eligible.enrollment_id, null);
    assert.deepEqual(eligible.pending_prerequisite_course_ids, []);

    await sql`
      insert into cursos.course_prerequisites (course_id, prerequisite_course_id)
      values (${blockedTarget.id}, ${incompletePrerequisite.courseId})
    `;

    const blocked = await resolveCanEnroll(profile.id, blockedTarget.id);
    assert.equal(blocked.user_id, profile.id);
    assert.equal(blocked.course_id, blockedTarget.id);
    assert.equal(blocked.can_enroll, false);
    assert.equal(blocked.reason, "prerequisites_incomplete");
    assert.deepEqual(blocked.pending_prerequisite_course_ids, [incompletePrerequisite.courseId]);

    await sql`
      insert into cursos.enrollments (id, user_id, course_id, status)
      values (${randomUUID()}, ${profile.id}, ${eligibleTarget.id}, 'active')
    `;

    const alreadyEnrolled = await resolveCanEnroll(profile.id, eligibleTarget.id);
    assert.equal(alreadyEnrolled.can_enroll, false);
    assert.equal(alreadyEnrolled.reason, "already_enrolled");
  } finally {
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

test("course prerequisite cycle detection prevents invalid inserts", async () => {
  const sql = createClient();

  // Create three courses A -> B -> C and then try to insert C -> A which should fail
  const a = await createCourse(sql, "cycle-a");
  const b = await createCourse(sql, "cycle-b");
  const c = await createCourse(sql, "cycle-c");

  try {
    await sql`insert into cursos.course_prerequisites (course_id, prerequisite_course_id) values (${a.id}, ${b.id})`;
    await sql`insert into cursos.course_prerequisites (course_id, prerequisite_course_id) values (${b.id}, ${c.id})`;

    let threw = false;
    try {
      await sql`insert into cursos.course_prerequisites (course_id, prerequisite_course_id) values (${c.id}, ${a.id})`;
    } catch (err) {
      threw = true;
    }

    assert.equal(threw, true, 'expected cycle-inserting to throw an error');
  } finally {
    await sql`delete from cursos.course_prerequisites where course_id = any(${[a.id, b.id, c.id]}) or prerequisite_course_id = any(${[a.id, b.id, c.id]})`;
    await sql`delete from cursos.courses where id = any(${[a.id, b.id, c.id]})`;
    await sql.end({ timeout: 5 });
  }
});

test("sequential progress enforcement prevents skipping lessons", async () => {
  const sql = createClient();
  const profile = await createProfile(sql, "student-seq");
  const course = await createCourse(sql, "seq-course");
  const moduleId = randomUUID();
  const lesson1 = randomUUID();
  const lesson2 = randomUUID();
  const enrollmentId = randomUUID();

  try {
    await sql`insert into cursos.modules (id, course_id, title, position) values (${moduleId}, ${course.id}, 'mod', 1)`;
    await sql`insert into cursos.lessons (id, module_id, title, content, position) values (${lesson1}, ${moduleId}, 'l1', ${null}, 1)`;
    await sql`insert into cursos.lessons (id, module_id, title, content, position) values (${lesson2}, ${moduleId}, 'l2', ${null}, 2)`;
    await sql`insert into cursos.enrollments (id, user_id, course_id, status) values (${enrollmentId}, ${profile.id}, ${course.id}, 'active')`;

    // Try to complete lesson2 without completing lesson1 -> should throw
    let threw = false;
    try {
      await sql`insert into cursos.progress (id, enrollment_id, lesson_id, completed, completed_at) values (${randomUUID()}, ${enrollmentId}, ${lesson2}, true, now())`;
    } catch (err) {
      threw = true;
    }
    assert.equal(threw, true, 'expected completing lesson2 before lesson1 to fail');

    // Complete lesson1 then complete lesson2
    await sql`insert into cursos.progress (id, enrollment_id, lesson_id, completed, completed_at) values (${randomUUID()}, ${enrollmentId}, ${lesson1}, true, now())`;
    await sql`insert into cursos.progress (id, enrollment_id, lesson_id, completed, completed_at) values (${randomUUID()}, ${enrollmentId}, ${lesson2}, true, now())`;

  } finally {
    await sql`delete from cursos.progress where enrollment_id = ${enrollmentId}`;
    await sql`delete from cursos.enrollments where id = ${enrollmentId}`;
    await sql`delete from cursos.lessons where id = any(${[lesson1, lesson2]})`;
    await sql`delete from cursos.modules where id = ${moduleId}`;
    await sql`delete from cursos.courses where id = ${course.id}`;
    await sql`delete from cursos.profiles where id = ${profile.id}`;
    await sql.end({ timeout: 5 });
  }
});
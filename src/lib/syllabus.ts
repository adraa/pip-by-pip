import raw from '../data/syllabus.json';
import { courseBlurbs, sectionBlurbs } from '../data/blurbs';

export type RawLesson = { slug: string; title: string; source: string };
export type RawSection = { slug: string; title: string; grade: number | null; lessons: RawLesson[] };
export type RawCourse = { slug: string; title: string; sections: RawSection[] };

export type Lesson = RawLesson & {
  courseSlug: string;
  courseTitle: string;
  sectionSlug: string;
  sectionTitle: string;
  /** 1-based position across the whole school. */
  order: number;
  href: string;
};

export type Section = Omit<RawSection, 'lessons'> & {
  courseSlug: string;
  blurb: string;
  lessons: Lesson[];
  /** "Grade 3" when the section is graded, otherwise null. */
  gradeLabel: string | null;
};

export type Course = {
  slug: string;
  title: string;
  /** 1-based position in the school, matching "Course 3 of 11". */
  number: number;
  blurb: string;
  sections: Section[];
  lessons: Lesson[];
  lessonCount: number;
  href: string;
};

const courses: Course[] = [];
const lessonsInOrder: Lesson[] = [];

for (const [courseIndex, rawCourse] of (raw as RawCourse[]).entries()) {
  const sections: Section[] = [];
  const courseLessons: Lesson[] = [];

  for (const rawSection of rawCourse.sections) {
    const lessons: Lesson[] = rawSection.lessons.map((rawLesson) => {
      const lesson: Lesson = {
        ...rawLesson,
        courseSlug: rawCourse.slug,
        courseTitle: rawCourse.title,
        sectionSlug: rawSection.slug,
        sectionTitle: rawSection.title,
        order: lessonsInOrder.length + 1,
        href: `/learn/${rawCourse.slug}/${rawLesson.slug}`,
      };
      lessonsInOrder.push(lesson);
      courseLessons.push(lesson);
      return lesson;
    });

    sections.push({
      slug: rawSection.slug,
      title: rawSection.title,
      grade: rawSection.grade,
      gradeLabel: rawSection.grade === null ? null : `Grade ${rawSection.grade}`,
      courseSlug: rawCourse.slug,
      blurb: sectionBlurbs[`${rawCourse.slug}/${rawSection.slug}`] ?? '',
      lessons,
    });
  }

  courses.push({
    slug: rawCourse.slug,
    title: rawCourse.title,
    number: courseIndex + 1,
    blurb: courseBlurbs[rawCourse.slug] ?? '',
    sections,
    lessons: courseLessons,
    lessonCount: courseLessons.length,
    href: `/learn/${rawCourse.slug}`,
  });
}

export const SCHOOL: Course[] = courses;
export const ALL_LESSONS: Lesson[] = lessonsInOrder;
export const TOTAL_LESSONS = lessonsInOrder.length;

const lessonBySlug = new Map(lessonsInOrder.map((lesson) => [lesson.slug, lesson]));
const courseBySlug = new Map(courses.map((course) => [course.slug, course]));

export function getCourse(slug: string): Course | undefined {
  return courseBySlug.get(slug);
}

export function getLesson(slug: string): Lesson | undefined {
  return lessonBySlug.get(slug);
}

export function getNeighbours(lesson: Lesson): { previous: Lesson | null; next: Lesson | null } {
  return {
    previous: lessonsInOrder[lesson.order - 2] ?? null,
    next: lessonsInOrder[lesson.order] ?? null,
  };
}

/** Short label used in breadcrumbs: "Grade 3 · Fibonacci" or just the section title. */
export function sectionLabel(section: Pick<Section, 'gradeLabel' | 'title'>): string {
  return section.gradeLabel ? `${section.gradeLabel} · ${section.title}` : section.title;
}

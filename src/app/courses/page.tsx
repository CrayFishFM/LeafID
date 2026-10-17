import { CourseCard } from '@/components/CourseCard';
import { getUser } from '@/lib/auth';
import { courseCards } from '@/lib/courses';

export const metadata = { title: 'Courses' };

export default async function CoursesPage() {
  const user = await getUser();
  const courses = await courseCards(user?.id);

  return (
    <div className="stack" style={{ gap: '1.5rem' }}>
      <div>
        <p className="eyebrow">Courses</p>
        <h1>Pick a course</h1>
        <p className="muted">
          Quizzes adapt to you: whatever you miss comes back more often until it sticks. Study guides cover the rest.
        </p>
      </div>
      <div className="grid grid-2">
        {courses.map((c) => <CourseCard key={c.id} course={c} />)}
      </div>
    </div>
  );
}

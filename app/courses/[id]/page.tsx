// app/courses/[id]/page.tsx
type PageProps = {
  params: Promise<{ id: string }>;
};

type Course = {
  id: number;
  title: string;
  description: string;
  category?: { name?: string };
  level?: string | null;
  duration?: string | null;
};

async function getCourse(id: string): Promise<Course> {
  const res = await fetch(`http://localhost:3000/api/courses/${id}`, {
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok || !json?.data) {
    console.error("getCourse error:", json);
    throw new Error(json?.message || "Không lấy được chi tiết khóa học");
  }

  return json.data as Course;
}

export default async function CourseDetailPage({ params }: PageProps) {
  // 🔥 params là Promise → cần await
  const { id } = await params;

  const course = await getCourse(id);

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-8">
      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <p className="text-slate-300 mb-4">{course.description}</p>

      <div className="flex gap-4 text-sm text-slate-400">
        {course.category?.name && (
          <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
            {course.category.name}
          </span>
        )}

        {course.level && (
          <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
            {course.level}
          </span>
        )}

        {course.duration && (
          <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
            Thời lượng: {course.duration}
          </span>
        )}
      </div>
    </div>
  );
}

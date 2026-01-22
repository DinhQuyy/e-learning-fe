import { NextRequest, NextResponse } from 'next/server';
import { directusRequest } from '@/lib/directus';

// GET /api/quizzes - List all quizzes (with filters)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const courseId = searchParams.get('courseId');
    const lessonId = searchParams.get('lessonId');
    const isPublished = searchParams.get('isPublished');

    // ✅ Build filter properly typed
    const filter: Record<string, any> = {};
    if (courseId) filter.course_id = { _eq: courseId };
    if (lessonId) filter.lesson_id = { _eq: lessonId };
    if (isPublished !== null) filter.is_published = { _eq: isPublished === 'true' };

    // ✅ Fields as array of strings
    const fields: string[] = [
      '*',
      'questions.*',
      'questions.answers.*',
      'course.id',
      'course.title',
      'lesson.id',
      'lesson.title',
    ];

    // Fetch from Directus
    const response = await directusRequest<{ data: any[] }>('items/quizzes', {
      method: 'GET',
      filter: Object.keys(filter).length > 0 ? filter : undefined,
      fields: fields,
    });

    return NextResponse.json({ quizzes: response.data || [] });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}

// POST /api/quizzes - Create new quiz
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.course_id) {
      return NextResponse.json(
        { error: 'Missing required fields: title, course_id' },
        { status: 400 }
      );
    }

    // Create quiz in Directus
    const response = await directusRequest<{ data: any }>('items/quizzes', {
      method: 'POST',
      body: {
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });

    return NextResponse.json({ quiz: response.data }, { status: 201 });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to create quiz' },
      { status: 500 }
    );
  }
}
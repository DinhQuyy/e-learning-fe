'use client';

import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookOpen, Plus, Search, Eye, Edit2, Trash2, X } from 'lucide-react';

type CourseStatus =
  | 'published'
  | 'draft'
  | 'pending_review'
  | 'needs_changes'
  | 'rejected'
  | string;

type Category = {
  id: string | number;
  title: string;
};

type Course = {
  id: string | number;
  title: string;
  instructor: string;
  categoryId: number | string | null;
  categoryName: string;
  price: number;
  status: CourseStatus;
  students: number;
  rating: number;
  lessons: number;
  duration: string;
  slug?: string;
  description?: string;
  level?: string | null;
  thumbnail?: string | null;
};

type CourseForm = {
  title: string;
  instructor: string;
  slug: string;
  description: string;
  price: number;
  lessons: number;
  duration: string;
  level: string | null;
  thumbnail: string | null;
  category: string | number | null;
  status: CourseStatus;
};

type QualityCheck = {
  label: string;
  passed: boolean;
  penalty: number;
  issue: string;
};

type QualityGate = {
  score: number;
  checklist: { label: string; passed: boolean }[];
  issues: string[];
};

type ReviewAction = 'approve' | 'reject' | 'needs_changes';

const normalize = (value: unknown) =>
  String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const slugify = (value: unknown) =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

const generateSlug = (title: string) => {
  const base = slugify(title) || 'course';
  const randomId = Math.random().toString(36).slice(2, 8);
  return `${base}-${randomId}`;
};

const emptyForm: CourseForm = {
  title: '',
  instructor: '',
  slug: '',
  description: '',
  price: 0,
  lessons: 0,
  duration: '',
  level: null,
  thumbnail: null,
  category: null,
  status: 'draft',
};

const getStatusLabel = (status: CourseStatus) => {
  switch (status) {
    case 'published':
      return 'Đã mở';
    case 'draft':
      return 'Nháp';
    case 'pending_review':
      return 'Chờ duyệt';
    case 'needs_changes':
      return 'Cần chỉnh sửa';
    case 'rejected':
      return 'Từ chối';
    default:
      return status || 'Không rõ';
  }
};

const getStatusBadge = (status: CourseStatus) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800';
    case 'draft':
      return 'bg-gray-100 text-gray-700';
    case 'pending_review':
      return 'bg-amber-100 text-amber-800';
    case 'needs_changes':
      return 'bg-orange-100 text-orange-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

const getQualityTone = (score: number) => {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const getQualityLabel = (score: number) => {
  if (score >= 80) return 'Tốt';
  if (score >= 60) return 'Đạt mức cơ bản';
  return 'Cần cải thiện';
};

const buildQualityGate = (course: Course): QualityGate => {
  const titleLength = course.title?.trim().length ?? 0;
  const descriptionLength = course.description?.trim().length ?? 0;
  const lessonCount = Number(course.lessons ?? 0);
  const hasDuration = Boolean(course.duration?.trim());
  const hasThumbnail = Boolean(course.thumbnail);
  const hasLevel = Boolean(course.level);
  const hasCategory = course.categoryId != null && String(course.categoryId).length > 0;

  const checks: QualityCheck[] = [
    {
      label: 'Tiêu đề rõ ràng (>= 15 ký tự)',
      passed: titleLength >= 15,
      penalty: 10,
      issue: 'Tiêu đề quá ngắn',
    },
    {
      label: 'Mô tả đầy đủ (>= 80 ký tự)',
      passed: descriptionLength >= 80,
      penalty: 20,
      issue: 'Mô tả chưa đầy đủ',
    },
    {
      label: 'Tối thiểu 10 bài học',
      passed: lessonCount >= 10,
      penalty: 15,
      issue: 'Chưa đủ số bài học tối thiểu',
    },
    {
      label: 'Có thời lượng khóa học',
      passed: hasDuration,
      penalty: 10,
      issue: 'Chưa có thời lượng khóa học',
    },
    {
      label: 'Có ảnh thumbnail',
      passed: hasThumbnail,
      penalty: 10,
      issue: 'Thiếu ảnh thumbnail',
    },
    {
      label: 'Có cấp độ',
      passed: hasLevel,
      penalty: 5,
      issue: 'Chưa chọn cấp độ',
    },
    {
      label: 'Có danh mục',
      passed: hasCategory,
      penalty: 5,
      issue: 'Chưa chọn danh mục',
    },
  ];

  const totalPenalty = checks.reduce((sum, item) => sum + (item.passed ? 0 : item.penalty), 0);
  const score = Math.max(0, Math.min(100, 100 - totalPenalty));

  return {
    score,
    checklist: checks.map((item) => ({ label: item.label, passed: item.passed })),
    issues: checks.filter((item) => !item.passed).map((item) => item.issue),
  };
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'moderation'>('all');

  const searchParams = useSearchParams();

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (!tabParam) return;

    if (tabParam === 'pending-review' || tabParam === 'pending') {
      setActiveTab('pending');
      return;
    }

    if (tabParam === 'moderation' || tabParam === 'reports') {
      setActiveTab('moderation');
      return;
    }

    if (tabParam === 'all') {
      setActiveTab('all');
    }
  }, [searchParams]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<CourseStatus | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | string>('all');

  const [openModal, setOpenModal] = useState<'create' | 'edit' | 'view' | null>(null);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [form, setForm] = useState<CourseForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [reviewCourse, setReviewCourse] = useState<Course | null>(null);
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const selectedCourse = useMemo(
    () => courses.find((c) => String(c.id) === String(selectedId)),
    [courses, selectedId]
  );

  // ===== Fetch courses + categories =====
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setError(null);

        const [coursesRes, categoriesRes] = await Promise.all([
          fetch('/api/courses', { cache: 'no-store' }),
          fetch('/api/categories', { cache: 'no-store' }),
        ]);

        const coursesJson = await coursesRes.json().catch(() => null);
        const categoriesJson = await categoriesRes.json().catch(() => null);

        if (!coursesRes.ok || !coursesJson) {
          throw new Error(coursesJson?.message || 'Không lấy được danh sách khóa học');
        }

        const rawCourses: any[] = Array.isArray(coursesJson?.courses)
          ? coursesJson.courses
          : Array.isArray(coursesJson?.data)
            ? coursesJson.data
            : [];

        const rawCategories: any[] = Array.isArray(categoriesJson?.categories)
          ? categoriesJson.categories
          : Array.isArray(categoriesJson?.data)
            ? categoriesJson.data
            : [];

        const catsMapped: Category[] = rawCategories.map((c) => ({
          id: c.id,
          title: c.title ?? c.name ?? String(c.id),
        }));
        setCategories(catsMapped);

        const catMap = new Map<string, string>(catsMapped.map((c) => [String(c.id), c.title]));

        const mappedCourses: Course[] = rawCourses.map((c) => {
          const categoryId = c.category ?? null;
          const categoryName =
            categoryId != null ? catMap.get(String(categoryId)) ?? String(categoryId) : '';

          return {
            id: c.id,
            title: c.title ?? c.name ?? '',
            instructor: c.teacher_name ?? c.instructor_name ?? c.instructor ?? '',
            categoryId,
            categoryName,
            price: Number(c.price ?? 0),
            status: c.status ?? 'draft',
            students: Number(c.students ?? c.students_count ?? 0),
            rating: Number(c.rating ?? c.rating_avg ?? 0),
            lessons: Number(c.lessons ?? c.lessons_count ?? 0),
            duration: c.duration ?? '',
            slug: c.slug ?? '',
            description: c.description ?? '',
            level: c.level ?? null,
            thumbnail: c.thumbnail ?? null,
          };
        });

        setCourses(mappedCourses);
      } catch (err: any) {
        console.error('CoursesPage fetch error:', err);
        setError(err?.message || 'Không lấy được danh sách khóa học');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const matchesCategory = (course: Course) =>
    filterCategory === 'all' ||
    String(course.categoryId ?? '') === String(filterCategory);

  const matchesSearch = (course: Course) => {
    const term = normalize(searchTerm);
    if (!term) return true;

    const haystack =
      normalize(course.title) +
      ' ' +
      normalize(course.instructor) +
      ' ' +
      normalize(course.categoryName);

    return haystack.includes(term);
  };

  // ===== Filter/search =====
  const filteredCourses = useMemo(
    () =>
      courses.filter((course) => {
        if (filterStatus !== 'all' && course.status !== filterStatus) return false;
        if (!matchesCategory(course)) return false;
        if (!matchesSearch(course)) return false;
        return true;
      }),
    [courses, filterStatus, filterCategory, searchTerm]
  );

  const pendingCourses = useMemo(
    () =>
      courses.filter(
        (course) =>
          course.status === 'pending_review' && matchesCategory(course) && matchesSearch(course)
      ),
    [courses, filterCategory, searchTerm]
  );

  // ===== Stats =====
  const totalCourses = courses.length;
  const openedCourses = courses.filter((c) => c.status === 'published').length;
  const pendingCount = courses.filter((c) => c.status === 'pending_review').length;
  const totalStudents = courses.reduce((sum, c) => sum + (c.students || 0), 0);
  const rated = courses.filter((c) => (c.rating || 0) > 0);
  const avgRating =
    rated.length > 0
      ? (rated.reduce((sum, c) => sum + (c.rating || 0), 0) / rated.length).toFixed(1)
      : '0.0';

  // =========================
  // CRUD handlers
  // =========================
  const openCreate = () => {
    setSelectedId(null);
    setForm(emptyForm);
    setOpenModal('create');
  };

  const openView = (course: Course) => {
    setSelectedId(course.id);
    setOpenModal('view');
  };

  const openEdit = (course: Course) => {
    setSelectedId(course.id);

    setForm({
      title: course.title ?? '',
      instructor: course.instructor ?? '',
      slug: course.slug ?? '',
      description: course.description ?? '',
      price: Number(course.price ?? 0),
      lessons: Number(course.lessons ?? 0),
      duration: course.duration ?? '',
      level: course.level ?? null,
      thumbnail: course.thumbnail ?? null,
      category: course.categoryId ?? null,
      status: course.status ?? 'draft',
    });

    setOpenModal('edit');
  };

  const closeModal = () => {
    setOpenModal(null);
  };

  const refreshCourses = async () => {
    const res = await fetch('/api/courses', { cache: 'no-store' });
    const json = await res.json().catch(() => null);
    const rawCourses: any[] = Array.isArray(json?.courses)
      ? json.courses
      : Array.isArray(json?.data)
        ? json.data
        : [];

    const catMap = new Map<string, string>(categories.map((c) => [String(c.id), c.title]));

    const mappedCourses: Course[] = rawCourses.map((c) => {
      const categoryId = c.category ?? null;
      const categoryName =
        categoryId != null ? catMap.get(String(categoryId)) ?? String(categoryId) : '';

      return {
        id: c.id,
        title: c.title ?? c.name ?? '',
        instructor: c.teacher_name ?? c.instructor_name ?? c.instructor ?? '',
        categoryId,
        categoryName,
        price: Number(c.price ?? 0),
        status: c.status ?? 'draft',
        students: Number(c.students ?? c.students_count ?? 0),
        rating: Number(c.rating ?? c.rating_avg ?? 0),
        lessons: Number(c.lessons ?? c.lessons_count ?? 0),
        duration: c.duration ?? '',
        slug: c.slug ?? '',
        description: c.description ?? '',
        level: c.level ?? null,
        thumbnail: c.thumbnail ?? null,
      };
    });

    setCourses(mappedCourses);
  };

  const handleCreate = async () => {
    try {
      setSaving(true);
      const payload = {
        ...form,
        slug: form.slug || generateSlug(form.title),
        teacher_name: form.instructor,
      };
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(json?.message || 'Không tạo được khóa học');
      }

      await refreshCourses();
      closeModal();
    } catch (e: any) {
      alert(e?.message || 'Tạo khóa học thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedId) return;
    try {
      setSaving(true);

      const payload = {
        ...form,
        slug: form.slug || generateSlug(form.title),
        teacher_name: form.instructor,
      };
      const res = await fetch(`/api/courses/${selectedId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(json?.message || 'Không cập nhật được khóa học');
      }

      await refreshCourses();
      closeModal();
    } catch (e: any) {
      alert(e?.message || 'Cập nhật khóa học thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Bạn có chắc muốn xoá khóa học này?')) return;

    try {
      setSaving(true);

      const res = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
      });

      const text = await res.text();
      const json = text ? JSON.parse(text) : null;

      if (!res.ok) {
        throw new Error(json?.message || 'Không xoá được khóa học');
      }

      await refreshCourses();
    } catch (e: any) {
      alert(e?.message || 'Xoá khóa học thất bại');
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Review handlers
  // =========================
  const openReview = (course: Course) => {
    setReviewCourse(course);
    setReviewError(null);
  };

  const closeReview = () => {
    setReviewCourse(null);
    setReviewError(null);
  };

  const handleReviewAction = async (action: ReviewAction, reason: string) => {
    if (!reviewCourse) return;
    const trimmedReason = reason.trim();

    if (action !== 'approve' && !trimmedReason) {
      setReviewError('Vui lòng nhập lý do trước khi gửi yêu cầu.');
      return;
    }

    const nextStatus =
      action === 'approve'
        ? 'published'
        : action === 'needs_changes'
          ? 'needs_changes'
          : 'rejected';

    try {
      setReviewSaving(true);
      setReviewError(null);

      const res = await fetch(`/api/courses/${reviewCourse.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(json?.message || 'Không cập nhật trạng thái');
      }

      await refreshCourses();
      closeReview();
    } catch (err: any) {
      setReviewError(err?.message || 'Duyệt khóa học thất bại');
    } finally {
      setReviewSaving(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản lý khóa học</h1>
        <p className="mt-2 text-gray-600">Theo dõi và quản lý toàn bộ khóa học trong hệ thống</p>
        {error && (
          <p className="mt-1 text-sm text-orange-600">
            {error} — hãy kiểm tra API /api/courses.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Tổng số khóa học</p>
          <p className="mt-2 text-3xl font-bold">{loading ? '...' : totalCourses}</p>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Đã mở</p>
          <p className="mt-2 text-3xl font-bold">{loading ? '...' : openedCourses}</p>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Tổng học viên</p>
          <p className="mt-2 text-3xl font-bold">{loading ? '...' : totalStudents}</p>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Đánh giá trung bình</p>
          <p className="mt-2 text-3xl font-bold">{loading ? '...' : avgRating}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
            activeTab === 'all'
              ? 'border-blue-600 bg-blue-600 text-white'
              : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:text-blue-600'
          }`}
        >
          Tất cả khóa học
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {loading ? '...' : totalCourses}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
            activeTab === 'pending'
              ? 'border-amber-600 bg-amber-600 text-white'
              : 'border-gray-200 bg-white text-gray-700 hover:border-amber-300 hover:text-amber-700'
          }`}
        >
          Chờ duyệt
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              activeTab === 'pending' ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-700'
            }`}
          >
            {loading ? '...' : pendingCount}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('moderation')}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
            activeTab === 'moderation'
              ? 'border-slate-700 bg-slate-700 text-white'
              : 'border-gray-200 bg-white text-gray-700 hover:border-slate-300 hover:text-slate-700'
          }`}
        >
          Kiểm duyệt
        </button>
      </div>

      {activeTab !== 'moderation' && (
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {activeTab === 'all' && (
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as CourseStatus | 'all')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="published">Đã mở</option>
                  <option value="draft">Nháp</option>
                  <option value="pending_review">Chờ duyệt</option>
                  <option value="needs_changes">Cần chỉnh sửa</option>
                  <option value="rejected">Từ chối</option>
                </select>
              )}

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map((cat) => (
                  <option key={String(cat.id)} value={String(cat.id)}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>

            {activeTab === 'all' && (
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                Thêm khóa học
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === 'all' && (
        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Khóa học
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Giáo viên
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Học viên
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Đánh giá
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                    Tùy chọn
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {!loading && filteredCourses.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-sm text-center text-gray-500">
                      Không tìm thấy khóa học
                    </td>
                  </tr>
                )}

                {filteredCourses.map((course) => (
                  <tr key={String(course.id)} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg shrink-0">
                          <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{course.title}</div>
                          <div className="text-xs text-gray-500">
                            {course.lessons} bài học • {course.duration || 'Chưa cập nhật'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.instructor}</div>
                      <div className="text-xs text-gray-500">{course.categoryName}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.students}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₫{Number(course.price).toLocaleString('vi-VN')}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                          course.status
                        )}`}
                      >
                        {getStatusLabel(course.status)}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {course.rating > 0 ? (
                          <>
                            <span className="text-sm font-medium text-gray-900">
                              {course.rating}
                            </span>
                            <span className="text-yellow-400">★</span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-400">Chưa có</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openView(course)}
                          className="p-2 text-gray-600 rounded-lg hover:bg-gray-100"
                          title="Xem"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEdit(course)}
                          className="p-2 text-blue-600 rounded-lg hover:bg-blue-50"
                          title="Sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="p-2 text-red-600 rounded-lg hover:bg-red-50"
                          title="Xoá"
                          disabled={saving}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Khóa học
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Giáo viên
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Chất lượng
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {!loading && pendingCourses.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-sm text-center text-gray-500">
                      Không có khóa học nào đang chờ duyệt
                    </td>
                  </tr>
                )}

                {pendingCourses.map((course) => {
                  const quality = buildQualityGate(course);
                  const issuePreview =
                    quality.issues.length > 0
                      ? `Thiếu: ${quality.issues.slice(0, 2).join(', ')}`
                      : 'Không có vấn đề nổi bật';

                  return (
                    <tr key={String(course.id)} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-lg shrink-0">
                            <BookOpen className="w-6 h-6 text-amber-700" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{course.title}</div>
                            <div className="text-xs text-gray-500">
                              {course.lessons} bài học • {course.duration || 'Chưa cập nhật'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{course.instructor}</div>
                        <div className="text-xs text-gray-500">{course.categoryName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {quality.score}/100
                        </div>
                        <span
                          className={`mt-1 inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${getQualityTone(
                            quality.score
                          )}`}
                        >
                          {getQualityLabel(quality.score)}
                        </span>
                        <div className="mt-1 text-xs text-gray-500">{issuePreview}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openView(course)}
                            className="p-2 text-gray-600 rounded-lg hover:bg-gray-100"
                            title="Xem"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openReview(course)}
                            className="px-3 py-2 text-white bg-amber-600 rounded-lg hover:bg-amber-700"
                          >
                            Duyệt
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Đánh giá</p>
              <p className="mt-2 text-2xl font-bold">0</p>
              <p className="text-xs text-gray-500 mt-1">Chưa có dữ liệu trong bản demo.</p>
            </div>
            <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Bình luận</p>
              <p className="mt-2 text-2xl font-bold">0</p>
              <p className="text-xs text-gray-500 mt-1">Chưa có dữ liệu trong bản demo.</p>
            </div>
            <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Báo cáo</p>
              <p className="mt-2 text-2xl font-bold">0</p>
              <p className="text-xs text-gray-500 mt-1">Chưa có dữ liệu trong bản demo.</p>
            </div>
          </div>
          <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">
              Khu vực này dành cho kiểm duyệt đánh giá, bình luận và báo cáo từ học viên. Có thể
              kết nối dữ liệu và bổ sung bảng danh sách khi cần.
            </p>
          </div>
        </div>
      )}

      {openModal && (
        <CourseModal
          mode={openModal}
          saving={saving}
          form={form}
          setForm={setForm}
          categories={categories}
          course={selectedCourse ?? null}
          onClose={closeModal}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      )}

      {reviewCourse && (
        <ReviewModal
          course={reviewCourse}
          saving={reviewSaving}
          error={reviewError}
          onClose={closeReview}
          onAction={handleReviewAction}
        />
      )}
    </div>
  );
}

/* =======================
   Components
======================= */

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function CourseModal({
  mode,
  saving,
  form,
  setForm,
  categories,
  course,
  onClose,
  onCreate,
  onUpdate,
}: {
  mode: 'create' | 'edit' | 'view';
  saving: boolean;
  form: CourseForm;
  setForm: (v: CourseForm) => void;
  categories: Category[];
  course: Course | null;
  onClose: () => void;
  onCreate: () => Promise<void>;
  onUpdate: () => Promise<void>;
}) {
  const isView = mode === 'view';
  const title =
    mode === 'create' ? 'Thêm khóa học' : mode === 'edit' ? 'Chỉnh sửa khóa học' : 'Xem khóa học';
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || '';
  const currentThumbnailUrl = form.thumbnail
    ? form.thumbnail.startsWith('http')
      ? form.thumbnail
      : directusUrl
        ? `${directusUrl}/assets/${form.thumbnail}`
        : ''
    : '';
  const displayThumbnailUrl = thumbnailPreview || currentThumbnailUrl;

  useEffect(() => {
    setThumbnailPreview(null);
    setThumbnailError(null);
    setThumbnailUploading(false);
  }, [mode, course?.id]);

  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const handleThumbnailChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setThumbnailError('Vui lòng chọn tệp hình ảnh.');
      return;
    }

    setThumbnailError(null);
    setThumbnailUploading(true);
    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreview(previewUrl);

    try {
      const body = new FormData();
      body.append('file', file);

      const res = await fetch('/api/courses/media', {
        method: 'POST',
        body,
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || 'Tải ảnh thất bại.');
      }

      const fileId = data?.file?.id ?? data?.fileId ?? data?.id;

      if (!fileId) {
        throw new Error('Tải ảnh thất bại.');
      }

      setForm({ ...form, thumbnail: String(fileId) });
    } catch (error) {
      console.error('Upload thumbnail error:', error);
      setThumbnailError(error instanceof Error ? error.message : 'Tải ảnh thất bại.');
      setThumbnailPreview(null);
    } finally {
      setThumbnailUploading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="flex w-full max-w-2xl max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isView ? (
          <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-3">
            <div className="text-sm">
              <div className="font-semibold text-gray-900">{course?.title ?? '—'}</div>
              <div className="text-gray-600 mt-1">
                Giá: ₫{Number(course?.price ?? 0).toLocaleString('vi-VN')}
              </div>
              <div className="text-gray-600">Giáo viên: {course?.instructor ?? 'Không có'}</div>
              <div className="text-gray-600">Học viên: {course?.students ?? 0}</div>
              <div className="text-gray-600">Đánh giá: {course?.rating ?? 0}</div>
              <div className="text-gray-600">Bài học: {course?.lessons ?? 0}</div>
              <div className="text-gray-600">Thời lượng: {course?.duration ?? 'Chưa cập nhật'}</div>
              <div className="text-gray-600">
                Trạng thái: {getStatusLabel(course?.status ?? '—')}
              </div>
              <div className="text-gray-600">Danh mục: {course?.categoryName ?? '—'}</div>
              <div className="text-gray-600">Mô tả: {course?.description ?? '—'}</div>
              <div className="text-gray-600">Slug: {course?.slug ?? '—'}</div>
              <div className="text-gray-600">Cấp độ: {course?.level ?? '—'}</div>
              <div className="text-gray-600">Thumbnail: {course?.thumbnail ?? '—'}</div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          </div>
        ) : (
          <form
            className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              mode === 'create' ? onCreate() : onUpdate();
            }}
          >
            <Field label="Tiêu đề">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </Field>

            <Field label="Giáo viên">
              <input
                value={form.instructor}
                onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Giá (VND)">
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={0}
                />
              </Field>
              <Field label="Số bài học">
                <input
                  type="number"
                  value={form.lessons}
                  onChange={(e) => setForm({ ...form, lessons: Number(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={0}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Thời lượng">
                <input
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="vd: 45 giờ"
                />
              </Field>
              <Field label="Trạng thái">
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as CourseStatus })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Nháp</option>
                  <option value="pending_review">Chờ duyệt</option>
                  <option value="needs_changes">Cần chỉnh sửa</option>
                  <option value="rejected">Từ chối</option>
                  <option value="published">Đã mở</option>
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Danh mục">
                <select
                  value={form.category == null ? '' : String(form.category)}
                  onChange={(e) => setForm({ ...form, category: e.target.value || null })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((c) => (
                    <option key={String(c.id)} value={String(c.id)}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Cấp độ">
                <input
                  value={form.level ?? ''}
                  onChange={(e) => setForm({ ...form, level: e.target.value || null })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="vd: beginner / intermediate / advanced"
                />
              </Field>
            </div>

            <Field label="Ảnh thumbnail">
              <div className="space-y-3">
                {displayThumbnailUrl ? (
                  <img
                    src={displayThumbnailUrl}
                    alt="Ảnh thumbnail"
                    className="w-full max-h-48 rounded-lg object-cover border"
                  />
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-sm text-gray-500">
                    Chưa có ảnh thumbnail
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  disabled={thumbnailUploading}
                  className="w-full text-sm"
                />
                {thumbnailUploading && <p className="text-sm text-gray-500">Đang tải lên...</p>}
                {thumbnailError && <p className="text-sm text-red-600">{thumbnailError}</p>}
              </div>
            </Field>

            <Field label="Mô tả">
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </Field>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                disabled={saving}
              >
                Huỷ
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60"
                disabled={saving || thumbnailUploading}
              >
                {saving ? 'Đang lưu...' : mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ReviewModal({
  course,
  saving,
  error,
  onClose,
  onAction,
}: {
  course: Course;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onAction: (action: ReviewAction, reason: string) => void;
}) {
  const quality = useMemo(() => buildQualityGate(course), [course]);
  const [reason, setReason] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleAction = (action: ReviewAction) => {
    if (action !== 'approve' && !reason.trim()) {
      setLocalError('Vui lòng nhập lý do trước khi gửi.');
      return;
    }
    setLocalError(null);
    onAction(action, reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="flex w-full max-w-3xl max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="text-lg font-bold">Duyệt khóa học</h2>
            <p className="text-sm text-gray-500">{course.title}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.1fr_1.4fr]">
            <div className="p-4 border rounded-lg space-y-3">
              <div>
                <div className="text-sm text-gray-500">Điểm chất lượng</div>
                <div className="text-3xl font-bold">{quality.score}/100</div>
                <span
                  className={`mt-2 inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${getQualityTone(
                    quality.score
                  )}`}
                >
                  {getQualityLabel(quality.score)}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Khóa học: {course.lessons} bài • {course.duration || 'Chưa cập nhật'}
              </div>
              <div className="text-sm text-gray-600">
                Danh mục: {course.categoryName || 'Chưa chọn'}
              </div>
              <div className="text-sm text-gray-600">
                Giá: ₫{Number(course.price ?? 0).toLocaleString('vi-VN')}
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="text-sm font-semibold text-gray-900 mb-2">
                Checklist chất lượng
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                {quality.checklist.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span>{item.label}</span>
                    <span
                      className={`text-xs font-medium ${
                        item.passed ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {item.passed ? 'Đạt' : 'Chưa đạt'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="text-sm font-semibold text-gray-900">Gợi ý cải thiện</div>
                {quality.issues.length > 0 ? (
                  <ul className="mt-2 text-sm text-gray-600 list-disc pl-4 space-y-1">
                    {quality.issues.map((issue) => (
                      <li key={issue}>{issue}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-gray-600">Không có vấn đề nổi bật.</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Lý do (bắt buộc khi từ chối hoặc yêu cầu chỉnh sửa)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ví dụ: Thiếu mô tả chi tiết cho từng bài học..."
            />
            {(localError || error) && (
              <p className="mt-2 text-sm text-red-600">{localError || error}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 p-5 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            disabled={saving}
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={() => handleAction('needs_changes')}
            className="px-4 py-2 text-amber-700 bg-amber-100 rounded-lg hover:bg-amber-200 disabled:opacity-60"
            disabled={saving}
          >
            Yêu cầu chỉnh sửa
          </button>
          <button
            type="button"
            onClick={() => handleAction('reject')}
            className="px-4 py-2 text-red-700 bg-red-100 rounded-lg hover:bg-red-200 disabled:opacity-60"
            disabled={saving}
          >
            Từ chối
          </button>
          <button
            type="button"
            onClick={() => handleAction('approve')}
            className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-60"
            disabled={saving}
          >
            Phê duyệt
          </button>
        </div>
      </div>
    </div>
  );
}

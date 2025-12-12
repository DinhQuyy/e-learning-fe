'use client';

import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Plus, Search, Eye, Edit2, Trash2, X } from 'lucide-react';

type Category = {
  id: string | number;
  title: string; // hoặc name
};

type Course = {
  id: string | number;
  title: string;

  // ✅ đồng bộ: bạn đang dùng instructor ở UI
  instructor: string;

  categoryId: number | string | null;
  categoryName: string;

  price: number;
  status: 'published' | 'draft' | string;

  students: number;
  rating: number;
  lessons: number;
  duration: string;

  // optional nếu có
  slug?: string;
  description?: string;
  level?: string | null;
  thumbnail?: string | null;
};

type CourseForm = {
  title: string;
  slug: string;
  description: string;
  price: number;
  level: string | null;
  thumbnail: string | null;
  category: string | number | null; // gửi lên Directus
  status: 'published' | 'draft';
};

const normalize = (value: unknown) =>
  String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const emptyForm: CourseForm = {
  title: '',
  slug: '',
  description: '',
  price: 0,
  level: null,
  thumbnail: null,
  category: null,
  status: 'draft',
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | string>('all');

  const [openModal, setOpenModal] = useState<'create' | 'edit' | 'view' | null>(null);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [form, setForm] = useState<CourseForm>(emptyForm);
  const [saving, setSaving] = useState(false);

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
          throw new Error(coursesJson?.message || 'Không lấy được danh sách khoá học');
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
          const categoryId = c.category ?? null; // trong Directus courses.category là id
          const categoryName =
            categoryId != null ? catMap.get(String(categoryId)) ?? String(categoryId) : '';

          return {
            id: c.id,
            title: c.title ?? c.name ?? '',

            // nếu bạn có field teacher_name trong courses thì lấy; không có thì để rỗng
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
        setError(err?.message || 'Không lấy được danh sách khoá học');
        setCourses([]); // không fallback nữa vì bạn đã chạy data thật rồi
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ===== Filter/search =====
  const filteredCourses = useMemo(() => {
    const term = normalize(searchTerm);

    return courses.filter((course) => {
      if (filterStatus !== 'all' && course.status !== filterStatus) return false;

      if (filterCategory !== 'all') {
        if (String(course.categoryId ?? '') !== String(filterCategory)) return false;
      }

      if (!term) return true;

      const haystack =
        normalize(course.title) +
        ' ' +
        normalize(course.instructor) +
        ' ' +
        normalize(course.categoryName);

      return haystack.includes(term);
    });
  }, [courses, searchTerm, filterStatus, filterCategory]);

  // ===== Stats =====
  const totalCourses = courses.length;
  const openedCourses = courses.filter((c) => c.status === 'published').length;
  const totalStudents = courses.reduce((sum, c) => sum + (c.students || 0), 0);
  const rated = courses.filter((c) => (c.rating || 0) > 0);
  const avgRating =
    rated.length > 0
      ? (rated.reduce((sum, c) => sum + (c.rating || 0), 0) / rated.length).toFixed(1)
      : '0.0';

  const getStatusBadge = (status: string) =>
    status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

  // =========================
  // ✅ CRUD HANDLERS (KHÔNG MẤT KHI RELOAD)
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
      slug: course.slug ?? '',
      description: course.description ?? '',
      price: Number(course.price ?? 0),
      level: course.level ?? null,
      thumbnail: course.thumbnail ?? null,
      category: course.categoryId ?? null,
      status: (course.status === 'published' ? 'published' : 'draft') as any,
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
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(json?.message || 'Không tạo được khoá học');
      }

      await refreshCourses();
      closeModal();
    } catch (e: any) {
      alert(e?.message || 'Tạo khoá học thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedId) return;
    try {
      setSaving(true);

      const res = await fetch(`/api/courses/${selectedId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(json?.message || 'Không cập nhật được khoá học');
      }

      await refreshCourses();
      closeModal();
    } catch (e: any) {
      alert(e?.message || 'Cập nhật khoá học thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Bạn có chắc muốn xoá khoá học này?')) return;

    try {
      setSaving(true);

      const res = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
      });

      const text = await res.text();
      const json = text ? JSON.parse(text) : null;

      if (!res.ok) {
        throw new Error(json?.message || 'Không xoá được khoá học');
      }

      await refreshCourses();
    } catch (e: any) {
      alert(e?.message || 'Xoá khoá học thất bại');
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Courses Management</h1>
        <p className="mt-2 text-gray-600">Quản lý tất cả khóa học trong hệ thống</p>
        {error && (
          <p className="mt-1 text-sm text-orange-600">
            {error} — hãy kiểm tra API /api/courses.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Tổng lượng khoá học</p>
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

      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm khoá học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="published">Đã mở</option>
              <option value="draft">Chưa mở</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              {categories.map((cat) => (
                <option key={String(cat.id)} value={String(cat.id)}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Thêm khoá học
          </button>
        </div>
      </div>

      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Khoá học
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
                  Tình trạng
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Đánh giá
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                  Tuỳ chọn
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {!loading && filteredCourses.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-sm text-center text-gray-500">
                    Không tìm thấy khoá học
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
                          {course.lessons} lessons • {course.duration}
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
                      {course.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {course.rating > 0 ? (
                        <>
                          <span className="text-sm font-medium text-gray-900">{course.rating}</span>
                          <span className="text-yellow-400">★</span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
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

      {/* ✅ MODAL */}
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
    </div>
  );
}

/* =======================
   Modal Component
======================= */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
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
  const title = mode === 'create' ? 'Thêm khoá học' : mode === 'edit' ? 'Chỉnh sửa khoá học' : 'Xem khoá học';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* VIEW MODE */}
        {isView ? (
          <div className="p-6 space-y-3">
            <div className="text-sm">
              <div className="font-semibold text-gray-900">{course?.title ?? '—'}</div>
              <div className="text-gray-600 mt-1">Giá: ₫{Number(course?.price ?? 0).toLocaleString('vi-VN')}</div>
              <div className="text-gray-600">Trạng thái: {course?.status ?? '—'}</div>
              <div className="text-gray-600">Danh mục: {course?.categoryName ?? '—'}</div>
              <div className="text-gray-600">Mô tả: {course?.description ?? '—'}</div>
              <div className="text-gray-600">Slug: {course?.slug ?? '—'}</div>
              <div className="text-gray-600">Level: {course?.level ?? '—'}</div>
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
          // CREATE / EDIT
          <form
            className="p-6 space-y-4"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Slug">
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </Field>

              <Field label="Giá (VND)">
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={0}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Trạng thái">
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                </select>
              </Field>

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
            </div>

            <Field label="Level">
              <input
                value={form.level ?? ''}
                onChange={(e) => setForm({ ...form, level: e.target.value || null })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="vd: beginner / intermediate / advanced"
              />
            </Field>

            <Field label="Thumbnail (URL)">
              <input
                value={form.thumbnail ?? ''}
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value || null })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                disabled={saving}
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

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { User, UserRole, UserStatus } from '@/lib/types';

type TabKey = 'all' | 'verify' | 'progress';
type VerificationStatus = 'pending' | 'approved' | 'rejected';

interface Enrollment {
  id: string;
  title: string;
  progress: number;
}

const roleLabel: Record<UserRole, string> = {
  admin: 'Quản trị viên',
  instructor: 'Giảng viên',
  student: 'Học viên',
};

const statusLabel: Record<UserStatus, string> = {
  active: 'Hoạt động',
  inactive: 'Không hoạt động',
};

const verificationStatusLabel: Record<VerificationStatus, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
};

const sampleCourses = [
  { id: 'course-react', title: 'React nâng cao' },
  { id: 'course-node', title: 'Node.js thực chiến' },
  { id: 'course-uiux', title: 'UI/UX cho sản phẩm số' },
  { id: 'course-data', title: 'Phân tích dữ liệu cơ bản' },
  { id: 'course-next', title: 'Next.js từ A-Z' },
];

const seedEnrollments = (userId: string | number): Enrollment[] => {
  const numericSeed =
    parseInt(String(userId).replace(/\D/g, ''), 10) || 1;
  const count = 2 + (numericSeed % 3);
  const enrollments: Enrollment[] = [];

  for (let i = 0; i < count; i += 1) {
    const course =
      sampleCourses[(numericSeed + i) % sampleCourses.length];
    const progress = 10 + ((numericSeed * (i + 3)) % 80);
    enrollments.push({
      id: `${course.id}-${userId}`,
      title: course.title,
      progress,
    });
  }

  return enrollments;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(
    null,
  );

  const [verificationFilter, setVerificationFilter] =
    useState<VerificationStatus>('pending');
  const [verificationStatus, setVerificationStatus] = useState<
    Record<string, VerificationStatus>
  >({});
  const [verificationReason, setVerificationReason] = useState<
    Record<string, string>
  >({});
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [reasonTarget, setReasonTarget] = useState<User | null>(null);
  const [reasonAction, setReasonAction] =
    useState<VerificationStatus>('pending');
  const [reasonInput, setReasonInput] = useState('');

  const [progressSearch, setProgressSearch] = useState('');
  const [selectedProgressUserId, setSelectedProgressUserId] = useState<
    string | number | null
  >(null);
  const [enrollmentsMap, setEnrollmentsMap] = useState<
    Record<string, Enrollment[]>
  >({});

  // ===== Fetch dữ liệu thật từ API /api/admin/users =====
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setError(null);
        const res = await fetch('/api/admin/users');
        const json = await res.json().catch(() => null);

        if (!res.ok || !json) {
          throw new Error(
            (json as any)?.message ||
              'Không lấy được danh sách người dùng',
          );
        }

        setUsers(((json as any).users || []) as User[]);
      } catch (err: any) {
        console.error('UsersPage fetch error:', err);
        setError(
          err?.message || 'Không lấy được danh sách người dùng',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Helper: chuẩn hoá chuỗi để search tiếng Việt tốt hơn
  const normalize = (str: string | undefined | null) =>
    (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const filteredUsers = useMemo(() => {
    const term = normalize(searchTerm);
    return users.filter((user) => {
      if (!term) {
        return filterRole === 'all' || user.role === filterRole;
      }

      const matchesSearch =
        normalize(user.name).includes(term) ||
        normalize(user.email).includes(term);

      const matchesRole =
        filterRole === 'all' || user.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [filterRole, searchTerm, users]);

  const instructorUsers = useMemo(
    () => users.filter((user) => user.role === 'instructor'),
    [users],
  );

  useEffect(() => {
    setVerificationStatus((prev) => {
      const next = { ...prev };
      instructorUsers.forEach((user) => {
        const key = String(user.id);
        if (!next[key]) {
          next[key] = user.status === 'active' ? 'approved' : 'pending';
        }
      });
      return next;
    });
  }, [instructorUsers]);

  useEffect(() => {
    setEnrollmentsMap((prev) => {
      const next = { ...prev };
      users.forEach((user) => {
        const key = String(user.id);
        if (!next[key]) {
          next[key] = seedEnrollments(user.id);
        }
      });
      return next;
    });
  }, [users]);

  const verificationCounts = useMemo(() => {
    return instructorUsers.reduce(
      (acc, user) => {
        const status =
          verificationStatus[String(user.id)] || 'pending';
        acc[status] += 1;
        return acc;
      },
      { pending: 0, approved: 0, rejected: 0 },
    );
  }, [instructorUsers, verificationStatus]);

  const filteredVerificationUsers = useMemo(() => {
    return instructorUsers.filter((user) => {
      const status =
        verificationStatus[String(user.id)] || 'pending';
      return status === verificationFilter;
    });
  }, [instructorUsers, verificationFilter, verificationStatus]);

  const filteredProgressUsers = useMemo(() => {
    const term = normalize(progressSearch);
    if (!term) return users;
    return users.filter(
      (user) =>
        normalize(user.name).includes(term) ||
        normalize(user.email).includes(term),
    );
  }, [progressSearch, users]);

  const selectedProgressUser = useMemo(() => {
    if (!selectedProgressUserId) return null;
    return users.find(
      (user) =>
        String(user.id) === String(selectedProgressUserId),
    );
  }, [selectedProgressUserId, users]);

  const selectedEnrollments = useMemo(() => {
    if (!selectedProgressUser) return [];
    return enrollmentsMap[String(selectedProgressUser.id)] || [];
  }, [enrollmentsMap, selectedProgressUser]);

  // Role badge colors
  const getRoleBadge = (role: UserRole | string | undefined) => {
    const colors: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-800',
      instructor: 'bg-blue-100 text-blue-800',
      student: 'bg-green-100 text-green-800',
    };
    return colors[role || 'student'] || 'bg-gray-100 text-gray-800';
  };

  // Status badge colors
  const getStatusBadge = (status: UserStatus | string | undefined) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  };

  const getVerificationBadge = (status: VerificationStatus) => {
    const colors: Record<VerificationStatus, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  // Handle delete (xoá thật ở Directus)
  const handleDelete = async (id: string | number) => {
    if (!confirm('Bạn có chắc muốn xoá người dùng này?')) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        throw new Error(
          json?.message || 'Không xoá được người dùng trên server',
        );
      }

      // Xoá ở state local
      setUsers((prev) => prev.filter((u) => String(u.id) !== String(id)));
    } catch (err: any) {
      console.error('handleDelete error:', err);
      alert(err?.message || 'Không xoá được người dùng');
    } finally {
      setDeletingId(null);
    }
  };

  // Handle edit
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  // Handle add new
  const handleAddNew = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openVerificationAction = (
    user: User,
    action: VerificationStatus,
  ) => {
    setReasonTarget(user);
    setReasonAction(action);
    setReasonInput(verificationReason[String(user.id)] || '');
    setReasonModalOpen(true);
  };

  const handleConfirmVerification = () => {
    if (!reasonTarget) return;

    if (reasonAction === 'rejected' && !reasonInput.trim()) {
      alert('Vui lòng nhập lý do từ chối.');
      return;
    }

    const key = String(reasonTarget.id);
    setVerificationStatus((prev) => ({
      ...prev,
      [key]: reasonAction,
    }));
    setVerificationReason((prev) => ({
      ...prev,
      [key]: reasonInput.trim(),
    }));
    setReasonModalOpen(false);
  };

  const handleResetCourse = (
    userId: string | number,
    courseId: string,
  ) => {
    if (!confirm('Đặt lại tiến độ của khóa học này?')) return;

    setEnrollmentsMap((prev) => {
      const key = String(userId);
      const nextCourses = (prev[key] || []).map((course) =>
        course.id === courseId
          ? { ...course, progress: 0 }
          : course,
      );
      return { ...prev, [key]: nextCourses };
    });
  };

  const handleResetAllCourses = (userId: string | number) => {
    if (!confirm('Đặt lại toàn bộ tiến độ của người dùng này?'))
      return;

    setEnrollmentsMap((prev) => {
      const key = String(userId);
      const nextCourses = (prev[key] || []).map((course) => ({
        ...course,
        progress: 0,
      }));
      return { ...prev, [key]: nextCourses };
    });
  };

  // Handle save (gọi API POST / PATCH)
  const handleSave = async (userData: Partial<User>) => {
    try {
      setSaving(true);
      setError(null);

      if (editingUser) {
        // PATCH
        const res = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        const json = await res.json().catch(() => null);

        if (!res.ok || !json) {
          throw new Error(
            (json as any)?.message ||
              'Không cập nhật được người dùng',
          );
        }

        const updated = (json as any).user as User;

        setUsers((prev) =>
          prev.map((u) =>
            String(u.id) === String(updated.id) ? updated : u,
          ),
        );
      } else {
        // POST
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        const json = await res.json().catch(() => null);

        if (!res.ok || !json) {
          throw new Error(
            (json as any)?.message || 'Không tạo được người dùng',
          );
        }

        const created = (json as any).user as User;
        setUsers((prev) => [...prev, created]);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Save user error:', err);
      setError(err?.message || 'Không lưu được người dùng');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Quản lý người dùng
        </h1>
        <p className="mt-2 text-gray-600">
          Quản lý tài khoản, phân quyền, xác minh giảng viên và tiến độ
          học tập
        </p>
        {error && (
          <p className="mt-1 text-sm text-orange-600">
            {error} — đang hiển thị dữ liệu hiện có.
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'Tất cả người dùng' },
          { key: 'verify', label: 'Xác minh giảng viên' },
          { key: 'progress', label: 'Ghi danh & Tiến độ' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as TabKey)}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      {activeTab === 'all' && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Tổng người dùng</p>
            <p className="mt-2 text-3xl font-bold">
              {loading ? '...' : users.length}
            </p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Quản trị viên</p>
            <p className="mt-2 text-3xl font-bold">
              {loading
                ? '...'
                : users.filter((u) => u.role === 'admin').length}
            </p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Giảng viên</p>
            <p className="mt-2 text-3xl font-bold">
              {loading
                ? '...'
                : users.filter((u) => u.role === 'instructor').length}
            </p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Học viên</p>
            <p className="mt-2 text-3xl font-bold">
              {loading
                ? '...'
                : users.filter((u) => u.role === 'student').length}
            </p>
          </div>
        </div>
      )}

      {/* All Users */}
      {activeTab === 'all' && (
        <>
          {/* Filters & Actions */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              {/* Search */}
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Filter by Role */}
              <select
                value={filterRole}
                onChange={(e) =>
                  setFilterRole(e.target.value as UserRole | 'all')
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="admin">Quản trị viên</option>
                <option value="instructor">Giảng viên</option>
                <option value="student">Học viên</option>
              </select>

              {/* Add User Button */}
              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                Thêm mới
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Người dùng
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Vai trò
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Ngày tham gia
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                      Tuỳ chọn
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id as any} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-10 h-10 font-semibold text-white bg-blue-600 rounded-full">
                            {user.name?.charAt(0) || '?'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadge(
                            user.role,
                          )}`}
                        >
                          {roleLabel[user.role]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                            user.status,
                          )}`}
                        >
                          {statusLabel[user.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {user.joinedAt}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id as any)}
                            className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-50 disabled:opacity-50"
                            disabled={deletingId === user.id}
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

            {/* Empty State */}
            {!loading && filteredUsers.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-500">
                  Không tìm thấy người dùng
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Instructor Verification */}
      {activeTab === 'verify' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(
              [
                {
                  key: 'pending',
                  label: 'Chờ duyệt',
                  count: verificationCounts.pending,
                },
                {
                  key: 'approved',
                  label: 'Đã duyệt',
                  count: verificationCounts.approved,
                },
                {
                  key: 'rejected',
                  label: 'Từ chối',
                  count: verificationCounts.rejected,
                },
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                onClick={() =>
                  setVerificationFilter(item.key as VerificationStatus)
                }
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                  verificationFilter === item.key
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {item.label} ({item.count})
              </button>
            ))}
          </div>

          <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Giảng viên
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Lý do
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredVerificationUsers.map((user) => {
                    const status =
                      verificationStatus[String(user.id)] || 'pending';
                    const reason =
                      verificationReason[String(user.id)] || '-';

                    return (
                      <tr key={user.id as any} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getVerificationBadge(
                              status,
                            )}`}
                          >
                            {verificationStatusLabel[status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {reason}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                openVerificationAction(user, 'approved')
                              }
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100"
                            >
                              <Check className="w-4 h-4" />
                              Duyệt
                            </button>
                            <button
                              onClick={() =>
                                openVerificationAction(user, 'rejected')
                              }
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 rounded-lg hover:bg-red-100"
                            >
                              <X className="w-4 h-4" />
                              Từ chối
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {!loading && filteredVerificationUsers.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-500">
                  Không có yêu cầu phù hợp với bộ lọc
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enrollments / Progress */}
      {activeTab === 'progress' && (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-4 md:col-span-1">
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="relative">
                <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Tìm người dùng để xem tiến độ"
                  value={progressSearch}
                  onChange={(e) => setProgressSearch(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="divide-y divide-gray-200">
                {filteredProgressUsers.map((user) => (
                  <button
                    key={user.id as any}
                    onClick={() => setSelectedProgressUserId(user.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                      String(selectedProgressUserId) ===
                      String(user.id)
                        ? 'bg-blue-50'
                        : ''
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.email}
                    </div>
                  </button>
                ))}
              </div>

              {!loading && filteredProgressUsers.length === 0 && (
                <div className="py-10 text-center">
                  <p className="text-gray-500">Không có người dùng</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 md:col-span-2">
            <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Tiến độ học tập
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Chọn người dùng để xem khóa đang học và % hoàn thành.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              {selectedProgressUser ? (
                <div className="p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Người dùng</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {selectedProgressUser.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedProgressUser.email}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleResetAllCourses(selectedProgressUser.id)
                      }
                      className="px-3 py-2 text-xs font-semibold text-orange-700 bg-orange-50 rounded-lg hover:bg-orange-100"
                    >
                      Đặt lại tất cả tiến độ
                    </button>
                  </div>

                  <div className="space-y-3">
                    {selectedEnrollments.map((course, index) => (
                      <div
                        key={`${course.id}-${index}`}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {course.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {course.progress}% hoàn thành
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleResetCourse(
                                selectedProgressUser.id,
                                course.id,
                              )
                            }
                            className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100"
                          >
                            Đặt lại tiến độ
                          </button>
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-blue-600"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedEnrollments.length === 0 && (
                    <div className="py-8 text-center text-gray-500">
                      Người dùng này chưa có khóa học nào.
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-16 text-center text-gray-500">
                  Chọn một người dùng để xem tiến độ.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <UserModal
          user={editingUser}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          saving={saving}
        />
      )}

      {/* Reason Modal */}
      {reasonModalOpen && reasonTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">
                {reasonAction === 'approved'
                  ? 'Duyệt giảng viên'
                  : 'Từ chối giảng viên'}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {reasonTarget.name} — {reasonTarget.email}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Lý do (ghi chú nội bộ)
                </label>
                <textarea
                  rows={4}
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  placeholder="Nhập lý do xác minh hoặc từ chối"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setReasonModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Huỷ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmVerification}
                  className="flex-1 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== Modal ===== */

interface UserModalProps {
  user: User | null;
  onClose: () => void;
  onSave: (data: Partial<User>) => void;
  saving: boolean;
}

function UserModal({ user, onClose, onSave, saving }: UserModalProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: (user?.role || 'student') as UserRole,
    status: (user?.status || 'active') as UserStatus,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">
            {user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Họ tên
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Vai trò
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as UserRole,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">Học viên</option>
              <option value="instructor">Giảng viên</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as UserStatus,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? 'Đang lưu...' : user ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

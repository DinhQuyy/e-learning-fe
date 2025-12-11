'use client';

import { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { User, UserRole, UserStatus } from '@/lib/types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // ===== Fetch dữ liệu thật từ API /api/admin/users =====
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setError(null);
        const res = await fetch('/api/admin/users');
        const json = await res.json().catch(() => null);

        if (!res.ok || !json) {
          throw new Error(
            (json as any)?.message || 'Không lấy được danh sách người dùng',
          );
        }

        setUsers(((json as any).users || []) as User[]);
      } catch (err: any) {
        console.error('UsersPage fetch error:', err);
        setError(err?.message || 'Không lấy được danh sách người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Helper: chuẩn hoá chuỗi để search tiếng Việt tốt hơn (bỏ dấu + dư khoảng trắng)
  const normalize = (str: string | undefined | null) =>
    (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  // Filter users (theo tên/email + role)
  const filteredUsers = users.filter((user) => {
    const term = normalize(searchTerm);
    if (!term) {
      return filterRole === 'all' || user.role === filterRole;
    }

    const matchesSearch =
      normalize(user.name).includes(term) ||
      normalize(user.email).includes(term);

    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

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

  // Handle delete (xoá thật ở Directus)
  const handleDelete = async (id: string | number) => {
  if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return;

  try {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
    });
    const json = await res.json().catch(() => null);

    if (!res.ok || !json?.success) {
      throw new Error(json?.message || 'Không xoá được người dùng trên server');
    }

    // Xoá ở state local
    setUsers((prev) => prev.filter((u) => String(u.id) !== String(id)));
  } catch (err: any) {
    console.error('handleDelete error:', err);
    alert(err?.message || 'Không xoá được người dùng');
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
            (json as any)?.message || 'Không cập nhật được người dùng',
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
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="mt-2 text-gray-600">
          Quản lý người dùng và phân quyền hệ thống
        </p>
        {error && (
          <p className="mt-1 text-sm text-orange-600">
            {error} — đang hiển thị dữ liệu hiện có.
          </p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Tổng lượng người dùng</p>
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
          <p className="text-sm text-gray-600">Giáo viên</p>
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

      {/* Filters & Actions */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Search */}
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm...(Nhập tên học viên)"
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
            <option value="all">Tất cả</option>
            <option value="admin">Quản trị viên</option>
            <option value="instructor">Giáo viên</option>
            <option value="student">Học viên</option>
          </select>

          {/* Add User Button */}
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Thêm Mới
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
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                        user.status,
                      )}`}
                    >
                      {user.status}
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
            <p className="text-gray-500">Không tìm thấy người dùng</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <UserModal
          user={editingUser}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          saving={saving}
        />
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
            {user ? 'Edit User' : 'Add New User'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Họ Tên
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
              <option value="instructor">Giáo viên</option>
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
              {saving ? 'Đang lưu...' : user ? 'Chỉnh sửa' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

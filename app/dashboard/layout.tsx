export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 p-4 bg-white shadow">
        <h2 className="mb-4 text-xl font-bold">Dashboard</h2>
        <nav className="flex flex-col gap-2">
          <a href="/dashboard" className="hover:text-blue-500">Tổng quan</a>
          <a href="/dashboard/admin" className="hover:text-blue-500">Admin</a>
          <a href="/dashboard/instructor" className="hover:text-blue-500">Giảng viên</a>
          <a href="/dashboard/student" className="hover:text-blue-500">Học viên</a>
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

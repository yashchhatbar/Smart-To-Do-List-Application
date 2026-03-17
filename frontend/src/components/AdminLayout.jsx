import { NavLink, Outlet } from "react-router-dom";

import { useAdminAuth } from "../hooks/useAdminAuth";

function AdminLayout() {
  const { user, logout } = useAdminAuth();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-gray-200 bg-white px-6 py-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
              Admin Console
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-gray-900">Smart To-Do</h1>
            <p className="mt-2 text-sm text-gray-600">
              Signed in as {user?.name || "Administrator"}
            </p>
          </div>

          <nav className="mt-10 space-y-2">
            {[
              ["/admin", "Dashboard"],
              ["/admin/users", "Users"],
              ["/admin/activity-logs", "Activity Logs"],
            ].map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/admin"}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 text-sm font-medium transition duration-200 ${
                    isActive
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={logout}
            className="mt-10 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition duration-200 hover:bg-gray-100"
          >
            Logout
          </button>
        </aside>

        <main className="bg-gray-50 px-4 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

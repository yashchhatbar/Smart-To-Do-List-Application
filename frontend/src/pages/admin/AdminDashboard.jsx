import { useEffect, useState } from "react";

import ErrorMessage from "../../components/ErrorMessage";
import Loader from "../../components/Loader";
import { fetchAdminDashboard } from "../../services/adminService";
import { formatDeadline } from "../../utils/formatDate";
import { getApiErrorMessage } from "../../utils/api";

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetchAdminDashboard();
        setDashboard(response.data);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError, "Unable to load admin dashboard."));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-500">
          Overview
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900">Admin dashboard</h1>
      </div>

      <ErrorMessage message={error} />
      {loading ? <Loader label="Loading admin dashboard..." /> : null}

      {!loading && dashboard ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Total users", dashboard.total_users],
              ["Total tasks", dashboard.total_tasks],
              ["Active users (30d)", dashboard.total_active_users],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5"
              >
                <div className="text-sm text-gray-600">{label}</div>
                <div className="mt-3 text-4xl font-semibold text-gray-900">{value}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System activity</p>
                <h2 className="text-xl font-semibold text-gray-900">Recent activity</h2>
              </div>
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="rounded-l-lg px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="rounded-r-lg px-4 py-3 font-medium">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recent_activity_logs?.length ? (
                    dashboard.recent_activity_logs.map((log) => (
                      <tr
                        key={log.id}
                        className="border-b border-gray-200 transition duration-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-gray-900">{log.user?.email || "System"}</td>
                        <td className="px-4 py-3 capitalize text-gray-600">
                          {log.action.replaceAll("_", " ")}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{log.description}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {formatDeadline(log.created_at)}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{log.ip_address || "Unknown"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-10 text-center text-sm text-gray-400">
                        No recent activity found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}

export default AdminDashboard;

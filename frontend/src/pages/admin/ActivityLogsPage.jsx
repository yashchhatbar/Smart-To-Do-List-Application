import { useEffect, useState } from "react";

import ErrorMessage from "../../components/ErrorMessage";
import Loader from "../../components/Loader";
import { fetchActivityLogs } from "../../services/adminService";
import { formatDeadline } from "../../utils/formatDate";
import { getApiErrorMessage } from "../../utils/api";

const initialFilters = {
  action: "",
  date_from: "",
  date_to: "",
  user_id: "",
  page: 1,
};

function ActivityLogsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState(null);

  // ✅ BUILD CLEAN QUERY PARAMS
  const buildParams = () => {
    const params = {};

    if (filters.action) params.action = filters.action;

    if (filters.user_id.trim() !== "") {
      params.user_id = filters.user_id;
    }

    if (filters.date_from) {
      params.date_from = filters.date_from;
    }

    if (filters.date_to) {
      params.date_to = filters.date_to;
    }

    params.page = filters.page; // 🔥 IMPORTANT

    return params;
  };

  // ✅ FETCH LOGS
  const loadLogs = async () => {
    setLoading(true);
    setError("");

    try {
      const params = buildParams();

      console.log("Fetching page:", params.page); // DEBUG

      const response = await fetchActivityLogs(params);

      // ✅ HANDLE BOTH RESPONSE FORMATS SAFELY
      const logsData =
        response?.data?.logs || response?.logs || [];

      const paginationData =
        response?.data?.pagination || response?.pagination || null;

      setLogs(logsData);
      setPagination(paginationData);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load activity logs."));
    } finally {
      setLoading(false);
    }
  };

  // ✅ TRIGGER ON ANY FILTER CHANGE
  useEffect(() => {
    loadLogs();
  }, [filters]);

  // ✅ HANDLE FILTER CHANGE
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFilters((current) => ({
      ...current,
      [name]: value,
      page: 1, // reset page on filter change
    }));
  };

  // ✅ SAFE PAGINATION HANDLERS
  const goToPrevPage = () => {
    if (!pagination?.has_prev) return;

    setFilters((current) => ({
      ...current,
      page: Math.max(1, current.page - 1),
    }));
  };

  const goToNextPage = () => {
    if (!pagination?.has_next) return;

    setFilters((current) => ({
      ...current,
      page: current.page + 1,
    }));
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-500">
          Audit Trail
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900">
          Activity logs
        </h1>
      </div>

      <div className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:grid-cols-2 xl:grid-cols-4">
        <label>
          <span className="text-sm font-medium text-gray-700">Action</span>
          <select
            name="action"
            value={filters.action}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none transition duration-200 focus:ring-2 focus:ring-emerald-400"
          >
            <option value="">All actions</option>
            <option value="signup">Signup</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="task_create">Task create</option>
            <option value="task_update">Task update</option>
            <option value="task_delete">Task delete</option>
          </select>
        </label>

        <label>
          <span className="text-sm font-medium text-gray-700">From</span>
          <input
            type="date"
            name="date_from"
            value={filters.date_from}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none transition duration-200 focus:ring-2 focus:ring-emerald-400"
          />
        </label>

        <label>
          <span className="text-sm font-medium text-gray-700">To</span>
          <input
            type="date"
            name="date_to"
            value={filters.date_to}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none transition duration-200 focus:ring-2 focus:ring-emerald-400"
          />
        </label>

        <label>
          <span className="text-sm font-medium text-gray-700">User ID</span>
          <input
            type="text"
            name="user_id"
            value={filters.user_id}
            onChange={handleChange}
            placeholder="Optional UUID"
            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none transition duration-200 focus:ring-2 focus:ring-emerald-400"
          />
        </label>
      </div>

      <ErrorMessage message={error} />

      {loading && <Loader label="Loading activity logs..." />}

      {!loading && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
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
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-gray-200 transition duration-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-gray-900">{log.user?.email || "System"}</td>
                    <td className="px-4 py-3 capitalize text-gray-600">
                      {log.action.replaceAll("_", " ")}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{log.description}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDeadline(log.created_at)}</td>
                    <td className="px-4 py-3 text-gray-600">{log.ip_address || "Unknown"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center text-sm text-gray-400">
                    No activity logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          {pagination && (
            <div className="mt-4 flex flex-col gap-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-gray-600">
                Page {pagination.page} of {pagination.pages || 1}
              </p>

              <div className="flex gap-3">
                <button
                  disabled={!pagination.has_prev}
                  onClick={goToPrevPage}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Prev
                </button>

                <button
                  disabled={!pagination.has_next}
                  onClick={goToNextPage}
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-white transition duration-200 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default ActivityLogsPage;

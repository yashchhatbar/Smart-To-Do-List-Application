import { useEffect, useState } from "react";

import ErrorMessage from "../../components/ErrorMessage";
import Loader from "../../components/Loader";
import { fetchAdminUsers } from "../../services/adminService";
import { formatDeadline } from "../../utils/formatDate";
import { getApiErrorMessage } from "../../utils/api";

function UsersPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetchAdminUsers();
        setUsers(response.data.users || []);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError, "Unable to load users."));
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-500">
          Directory
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900">Users</h1>
      </div>

      <ErrorMessage message={error} />
      {loading ? <Loader label="Loading users..." /> : null}

      {!loading ? (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <table className="min-w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="rounded-l-lg px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="rounded-r-lg px-4 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.length ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 transition duration-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-gray-900">{user.name}</td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDeadline(user.created_at)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.is_admin
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.is_admin ? "Admin" : "User"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-10 text-center text-sm text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

export default UsersPage;

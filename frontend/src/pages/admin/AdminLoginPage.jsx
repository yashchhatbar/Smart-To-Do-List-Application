import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ErrorMessage from "../../components/ErrorMessage";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { adminLogin } from "../../services/adminAuthService";
import { getApiErrorMessage } from "../../utils/api";

function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAdminAuth();
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await adminLogin(formValues);
      login(response);
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to log in as admin."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500">
          Restricted access
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-gray-900">Admin login</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          This area is separate from the user application and is available only to admins.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <ErrorMessage message={error} />

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none transition duration-200 focus:ring-2 focus:ring-emerald-400"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">Password</span>
            <input
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none transition duration-200 focus:ring-2 focus:ring-emerald-400"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Enter Admin Console"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;

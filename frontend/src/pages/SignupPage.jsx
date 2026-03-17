import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ErrorMessage from "../components/ErrorMessage";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { signup as signupRequest } from "../services/authService";
import { getApiErrorMessage } from "../utils/api";

function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
  });
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
      const response = await signupRequest(formValues);
      login(response);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to create your account."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-radial">
      <Navbar />

      <main className="mx-auto flex max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">
            Create account
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-ink">Start organizing smarter</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Create your account and jump straight into your dashboard.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <ErrorMessage message={error} />

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Name</span>
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                name="password"
                value={formValues.password}
                onChange={handleChange}
                required
                minLength="8"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 focus:bg-white"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default SignupPage;

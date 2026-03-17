import { Link, NavLink } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-ink">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-lg font-semibold text-white">
            ST
          </span>
          <span className="text-lg font-semibold tracking-tight">Smart To-Do</span>
        </Link>

        <nav className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-slate-500 sm:inline">
                {user?.name}
              </span>
              <NavLink
                to="/dashboard"
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                Dashboard
              </NavLink>
              <button
                type="button"
                onClick={logout}
                className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;

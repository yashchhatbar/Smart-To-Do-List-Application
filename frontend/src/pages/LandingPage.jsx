import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";

function LandingPage() {
  return (
    <div className="min-h-screen bg-hero-radial">
      <Navbar />

      <main className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-16 sm:px-6 lg:px-8">
        <section className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full border border-brand-100 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-700 shadow-panel">
              Plan better. Finish faster.
            </p>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
              A focused task manager for deadlines, priorities, and daily momentum.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Smart To-Do keeps your personal workboard clean, searchable, and easy to act on from any device.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-panel">
            <div className="grid gap-4">
              {[
                ["High", "Submit sprint review", "Today, 6:00 PM"],
                ["Medium", "Plan study timetable", "Tomorrow, 8:30 AM"],
                ["Low", "Organize reading list", "Friday, 4:15 PM"],
              ].map(([priority, title, deadline]) => (
                <div key={title} className="rounded-3xl border border-slate-100 bg-paper p-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
                      {priority}
                    </span>
                    <span className="text-xs text-slate-500">{deadline}</span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-ink">{title}</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Clean overview, quick updates, and clear deadlines.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;

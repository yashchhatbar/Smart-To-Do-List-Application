const priorityOptions = [
  { label: "All priorities", value: "" },
  { label: "High priority", value: "high" },
  { label: "Medium priority", value: "medium" },
  { label: "Low priority", value: "low" },
];

const statusOptions = [
  { label: "All statuses", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
];

function Sidebar({ filters, onFilterChange, onCreateTask }) {
  return (
    <aside className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-panel">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">
          Workspace
        </p>
        <h2 className="mt-2 text-xl font-semibold text-ink">Task controls</h2>
      </div>

      <button
        type="button"
        onClick={onCreateTask}
        className="mb-6 w-full rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Add New Task
      </button>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Search</label>
          <input
            type="search"
            value={filters.search}
            onChange={(event) => onFilterChange("search", event.target.value)}
            placeholder="Search title or keyword"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Priority</label>
          <select
            value={filters.priority}
            onChange={(event) => onFilterChange("priority", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 focus:bg-white"
          >
            {priorityOptions.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
          <select
            value={filters.status}
            onChange={(event) => onFilterChange("status", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 focus:bg-white"
          >
            {statusOptions.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

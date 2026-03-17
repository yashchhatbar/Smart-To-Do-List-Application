import { formatDeadline } from "../utils/formatDate";

const priorityStyles = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700",
};

function TaskCard({ task, onEdit, onDelete, onToggleStatus, isBusy }) {
  const completed = task.status === "completed";

  return (
    <article className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-panel transition hover:-translate-y-0.5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${priorityStyles[task.priority] || "bg-slate-100 text-slate-700"}`}>
              {task.priority}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${completed ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
              {task.status}
            </span>
            {task.category ? (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {task.category}
              </span>
            ) : null}
          </div>

          <div>
            <h3 className={`text-lg font-semibold text-ink ${completed ? "line-through opacity-70" : ""}`}>
              {task.title}
            </h3>
            {task.description ? (
              <p className="mt-2 text-sm leading-6 text-slate-600">{task.description}</p>
            ) : null}
          </div>

          <p className="text-sm text-slate-500">Deadline: {formatDeadline(task.deadline)}</p>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          <button
            type="button"
            onClick={() => onToggleStatus(task)}
            disabled={isBusy}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {completed ? "Mark Pending" : "Complete"}
          </button>
          <button
            type="button"
            onClick={() => onEdit(task)}
            disabled={isBusy}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            disabled={isBusy}
            className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default TaskCard;

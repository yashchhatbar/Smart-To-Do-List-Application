import { useEffect, useState } from "react";

import ErrorMessage from "./ErrorMessage";

const initialValues = {
  title: "",
  description: "",
  priority: "medium",
  deadline: "",
  category: "",
  status: "pending",
};

function TaskForm({ isOpen, initialTask, onClose, onSubmit, loading, serverError }) {
  const [formValues, setFormValues] = useState(initialValues);

  useEffect(() => {
    if (!initialTask) {
      setFormValues(initialValues);
      return;
    }

    setFormValues({
      title: initialTask.title ?? "",
      description: initialTask.description ?? "",
      priority: initialTask.priority ?? "medium",
      deadline: initialTask.deadline ? initialTask.deadline.slice(0, 16) : "",
      category: initialTask.category ?? "",
      status: initialTask.status ?? "pending",
    });
  }, [initialTask]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...formValues,
      deadline: formValues.deadline ? new Date(formValues.deadline).toISOString() : null,
    });
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-panel">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">
              {initialTask ? "Edit Task" : "New Task"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">
              {initialTask ? "Update task details" : "Capture your next priority"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
          >
            Close
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <ErrorMessage message={serverError} />

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Title</span>
              <input
                name="title"
                value={formValues.title}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Category</span>
              <input
                name="category"
                value={formValues.category}
                onChange={handleChange}
                placeholder="Work, Study, Personal"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 focus:bg-white"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Description</span>
            <textarea
              name="description"
              rows="4"
              value={formValues.description}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 focus:bg-white"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Priority</span>
              <select
                name="priority"
                value={formValues.priority}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 focus:bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Status</span>
              <select
                name="status"
                value={formValues.status}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 focus:bg-white"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Deadline</span>
              <input
                type="datetime-local"
                name="deadline"
                value={formValues.deadline}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 focus:bg-white"
              />
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : initialTask ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;

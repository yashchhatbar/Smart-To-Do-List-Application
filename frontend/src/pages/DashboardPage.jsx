import { useState } from "react";

import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import { createTask, updateTask } from "../services/taskService";
import { getApiErrorMessage } from "../utils/api";

const initialFilters = {
  priority: "",
  status: "",
  search: "",
};

function DashboardPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState(initialFilters);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [savingTask, setSavingTask] = useState(false);
  const [taskFormError, setTaskFormError] = useState("");
  const [busyTaskId, setBusyTaskId] = useState("");

  const { tasks, loading, error, reload, removeTask, toggleTaskStatus } = useTasks(filters);

  const completedCount = tasks.filter((task) => task.status === "completed").length;
  const stats = {
    total: tasks.length,
    completed: completedCount,
    pending: tasks.length - completedCount,
  };

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setTaskFormError("");
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setTaskFormError("");
    setIsTaskModalOpen(true);
  };

  const closeModal = () => {
    if (savingTask) {
      return;
    }

    setIsTaskModalOpen(false);
    setEditingTask(null);
    setTaskFormError("");
  };

  const handleTaskSubmit = async (payload) => {
    setSavingTask(true);
    setTaskFormError("");

    try {
      if (editingTask) {
        await updateTask(editingTask.id, payload);
      } else {
        await createTask(payload);
      }

      await reload();
      closeModal();
    } catch (requestError) {
      setTaskFormError(getApiErrorMessage(requestError, "Unable to save task."));
    } finally {
      setSavingTask(false);
    }
  };

  const handleDelete = async (task) => {
    setBusyTaskId(task.id);
    try {
      await removeTask(task.id);
    } catch (requestError) {
      window.alert(getApiErrorMessage(requestError, "Unable to delete task."));
    } finally {
      setBusyTaskId("");
    }
  };

  const handleToggleStatus = async (task) => {
    setBusyTaskId(task.id);
    try {
      await toggleTaskStatus(task);
    } catch (requestError) {
      window.alert(getApiErrorMessage(requestError, "Unable to update task."));
    } finally {
      setBusyTaskId("");
    }
  };

  return (
    <div className="min-h-screen bg-hero-radial">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">
            Dashboard
          </p>
          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-ink">
                {user?.name ? `${user.name}'s tasks` : "Your tasks"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Review your priorities, update progress, and keep deadlines under control.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:w-auto">
              {[
                ["Total", stats.total],
                ["Pending", stats.pending],
                ["Completed", stats.completed],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-paper px-4 py-3 text-center">
                  <div className="text-xl font-semibold text-ink">{value}</div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <Sidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onCreateTask={openCreateModal}
          />

          <div className="space-y-5">
            <ErrorMessage message={error} />

            {loading ? <Loader label="Loading tasks..." /> : null}

            {!loading && !error && tasks.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-panel">
                <h2 className="text-xl font-semibold text-ink">No tasks found</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Create your first task or adjust the current filters.
                </p>
              </div>
            ) : null}

            {!loading &&
              !error &&
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                  isBusy={busyTaskId === task.id}
                />
              ))}
          </div>
        </section>
      </main>

      <TaskForm
        isOpen={isTaskModalOpen}
        initialTask={editingTask}
        onClose={closeModal}
        onSubmit={handleTaskSubmit}
        loading={savingTask}
        serverError={taskFormError}
      />
    </div>
  );
}

export default DashboardPage;

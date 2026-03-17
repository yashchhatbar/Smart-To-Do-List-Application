import { useEffect, useState } from "react";

import { deleteTask, fetchTasks, updateTask } from "../services/taskService";
import { getApiErrorMessage } from "../utils/api";

export function useTasks(filters) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const tasksData = await fetchTasks(filters);

      // ✅ FIXED: directly set array
      setTasks(tasksData ?? []);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load tasks."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filters.priority, filters.search, filters.status]);

  const removeTask = async (taskId) => {
    await deleteTask(taskId);
    setTasks((current) => current.filter((task) => task.id !== taskId));
  };

  const toggleTaskStatus = async (task) => {
    const nextStatus = task.status === "completed" ? "pending" : "completed";

    const updatedTask = await updateTask(task.id, { status: nextStatus });

    // ✅ FIXED: updateTask returns task directly
    setTasks((current) =>
      current.map((item) => (item.id === task.id ? updatedTask : item))
    );
  };

  return {
    tasks,
    loading,
    error,
    reload: loadTasks,
    removeTask,
    toggleTaskStatus,
  };
}
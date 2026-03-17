import api from "./api";

export async function fetchTasks(filters = {}) {
  const params = {};

  if (filters.priority) {
    params.priority = filters.priority;
  }
  if (filters.status) {
    params.status = filters.status;
  }
  if (filters.search) {
    params.search = filters.search;
  }

  const response = await api.get("/tasks", { params });
  return response.data.tasks;
}

export async function createTask(payload) {
  const response = await api.post("/tasks", payload);
  return response.data.task;
}

export async function updateTask(taskId, payload) {
  const response = await api.put(`/tasks/${taskId}`, payload);
  return response.data.task;
}

export async function deleteTask(taskId) {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.message;
}

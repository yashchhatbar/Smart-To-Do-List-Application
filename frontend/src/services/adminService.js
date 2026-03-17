import adminApi from "./adminApi";

export async function fetchAdminDashboard() {
  return adminApi.get("/admin/dashboard");
}

export async function fetchAdminUsers() {
  return adminApi.get("/admin/users");
}

export async function fetchActivityLogs(params) {
  return adminApi.get("/admin/activity-logs", { params });
}

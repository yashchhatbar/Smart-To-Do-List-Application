import adminApi from "./adminApi";

export async function adminLogin(payload) {
  return adminApi.post("/admin/login", payload);
}

export async function adminLogout() {
  return adminApi.post("/auth/logout");
}

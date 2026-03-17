import api from "./api";

export async function signup(payload) {
  return api.post("/auth/signup", payload);
}

export async function login(payload) {
  return api.post("/auth/login", payload);
}

export async function logout() {
  return api.post("/auth/logout");
}

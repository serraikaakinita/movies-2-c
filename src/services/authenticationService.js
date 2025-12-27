//const DEFAULT_BASE = "http://localhost:8080";;
const DEFAULT_BASE = "https://movies2cbackend-production.up.railway.app";
export const API_BASE = import.meta.env.VITE_API_BASE || DEFAULT_BASE;

const TOKEN_KEY = "access_token";
const USER_KEY = "user";

function emitAuthChanged() {
  window.dispatchEvent(new Event("auth_changed"));
}

export function saveToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  emitAuthChanged();
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function decodeJwtPayload(token) {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g,"+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isTokenExpired(token = getToken()){
  if (!token) return true;
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return true;
  const nowSec = Math.floor(Date.now() / 1000);
  return payload.exp <= nowSec;
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  emitAuthChanged();
}

function saveSession({ token, user }) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  emitAuthChanged();
}

export function isAuthenticated() {
  const token = getToken();
  return Boolean(token) && !isTokenExpired(token);
}

export async function SignUp(username, email, password) {
  const res = await fetch(`${API_BASE}/api/auth/create`, {
    method: "POST",
    headers: {"Content-Type": "application/json" },
    body:JSON.stringify({userName: username, email, password}),
  });
  
  if (!res.ok) throw new Error("Signup failed");

  const data = await res.json();
  return data;
}

export async function Login(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({email, password}),
  });

  if (!res.ok) throw new Error("Login failed");

  const data = await res.json();
  saveSession({token: data.token, user: data.user});
  return data;
}

export async function Logout() {
  const token = getToken();
  try{
    if (token) {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`},
      });
    }
  } catch {
  } finally {
    clearSession();
  }
}

export async function changePassword(oldPassword, newPassword) {
  const res = await authFetch("/api/auth/change-password", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({oldPassword, newPassword}),
  });
  
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || "Failed to change password");
  }

  return res.text().catch(()=>"Password changed");
}

export async function authFetch(path, options = {}) {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    clearSession();
    throw new Error("Session expired");
  }

  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    clearSession();
    throw new Error("Unauthorized");
  }

  return res;
}

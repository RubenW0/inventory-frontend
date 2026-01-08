const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL is not defined");
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("access");

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "API request failed");
  }

  if (response.status === 204) return null;

  return response.json();
}

export async function loginUser(data: {
  username: string;
  password: string;
}) {
  return apiFetch("/auth/login/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
  role: string;
}) {
  return apiFetch("/auth/register/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchMe() {
  return apiFetch("/auth/me/");
}

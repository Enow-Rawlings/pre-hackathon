const API = import.meta.env.VITE_API_URL;

export const getToken = () => localStorage.getItem("token");

async function request(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

// Auth
export const registerUser = (body) =>
  request("/auth/register", { method: "POST", body: JSON.stringify(body) });

export const loginUser = (body) =>
  request("/auth/login", { method: "POST", body: JSON.stringify(body) });

// Items
export const getItems = () => request("/items");

export const createItem = (item) =>
  request("/items", { method: "POST", body: JSON.stringify(item) });

export const updateItem = (id, changes) =>
  request(`/items/${id}`, { method: "PUT", body: JSON.stringify(changes) });

export const deleteItem = (id) => request(`/items/${id}`, { method: "DELETE" });
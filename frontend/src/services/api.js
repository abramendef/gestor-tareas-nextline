const BASE_URL = "http://localhost:3000/tasks";
const USER_ID = "evaluador-nextline-01";

async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-user-id": USER_ID,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }
  
  return null;
}

export const api = {
  getTasks: () => fetchAPI(""),
  getTask: (id) => fetchAPI(`/${id}`),
  createTask: (data) => fetchAPI("", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  updateTask: (id, data) => fetchAPI(`/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  deleteTask: (id) => fetchAPI(`/${id}`, {
    method: "DELETE",
  }),
};

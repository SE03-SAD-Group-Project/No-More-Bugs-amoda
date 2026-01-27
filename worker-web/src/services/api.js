const API_URL = "http://localhost:3001";

export const registerWorker = async (workerData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workerData),
    });
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return { status: "Error", message: "Network error" };
  }
};

export const loginWorker = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return { status: "Error", message: "Network error" };
  }
};

export const getWorkerProfile = async (id) => {
  try {
    const response = await fetch(`${API_URL}/worker/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Fetch Error:", error);
    return { status: "Error" };
  }
};

export const updateWorkerProfile = async (id, data) => {
  try {
    const response = await fetch(`${API_URL}/worker/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Update Error:", error);
    return { status: "Error" };
  }
};
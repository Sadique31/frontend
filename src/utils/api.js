const BASE_URL = "https://arabian-cafe-backend.onrender.com";

export const apiFetch = async (url, options = {}) => {
  let token = localStorage.getItem("token");

  let response = await fetch(BASE_URL + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (response.status === 400) {
    const data = await response.json();

    if (data.message === "Invalid token") {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        localStorage.clear();
        alert("Session expire ho gaya, please login karein");
        window.location.reload();
        return null;
      }

      const refreshRes = await fetch(BASE_URL + "/api/auth/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshRes.ok) {
        localStorage.clear();
        alert("Session expire ho gaya, please login karein");
        window.location.reload();
        return null;
      }

      const { token: newToken } = await refreshRes.json();
      localStorage.setItem("token", newToken);

      response = await fetch(BASE_URL + url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newToken}`,
          ...options.headers,
        },
      });
    }
  }

  return response;
};
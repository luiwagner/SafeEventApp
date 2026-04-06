const API_BASE_URL = "http://localhost:4000";

function register(email, firstname, lastname, password) {
  return fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, firstname, lastname, password })
  });
}

function login(email, password) {
  return fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.loginSuccessful && data.token) {
        localStorage.setItem("accessToken", data.token);
        // optional: auch refreshToken speichern
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
      }
      return data;
    });
}

function updateAccessToken() {
  return fetch(`${API_BASE_URL}/auth/updateAccessToken`, {
    method: "POST",
    credentials: "include"
  }).then(res => res.json());
}

export const authService = {
  register,
  login,
  updateAccessToken
};
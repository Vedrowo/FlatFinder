const API_URL = process.env.REACT_APP_API_URL;

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const registerUser = async (name, email, password, phone_number, role) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password, phone_number, role })
  });
  return res.json();
};

export const getApartments = async () => {
  const res = await fetch(`${API_URL}/apartments`, {
    credentials: "include"
  });
  return res.json();
};

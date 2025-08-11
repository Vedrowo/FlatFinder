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

export const getMyApartments = async (user_id) => {
  const res = await fetch(`${API_URL}/my-apartments?user_id=${user_id}`, {
    credentials: "include"
  })
  return res.json();
}

export async function createApartment(formData) {
  const response = await fetch(`${API_URL}/apartments`, {
    method: "POST",
    body: formData, // Send FormData directly
    credentials: 'include', // if needed
  });

  if (!response.ok) {
    throw new Error("Failed to create apartment");
  }
  return response.json();
}


export const getStudentListings = async () => {
  const res = await fetch(`${API_URL}/student-listings`, {
    credentials: "include"
  });
  return res.json();
}

export const getMyListings = async (user_id) => {
  const res = await fetch(`${API_URL}/my-student-listings?user_id=${user_id}`, {
    credentials: "include"
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch listings');
  }

  return res.json();
};

export async function createListing(listingData) {
  try {
    const response = await fetch(`${API_URL}/student-listings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(listingData),
    });

    if (!response.ok) {
      throw new Error("Failed to create listing");
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error creating listing:", error);
    throw error;
  }
}

export async function getApartmentById(apartmentId) {
  const response = await fetch(`${API_URL}/apartments/${apartmentId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch apartment");
  }
  const data = await response.json();
  return data;
}

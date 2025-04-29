export const fetchAuthentication = async (url, options = {}, toast) => {
  const response = await fetch(url, options);

  if (response.status === 401) {
    const errorText = await response.text();
    if (errorText.includes("Invalid or expired token")) {
      const refreshSuccess = await refreshToken();
      if (refreshSuccess) {
        return fetch(url, options);
      } else {
        localStorage.setItem(
          "auth",
          JSON.stringify({ isLoggedIn: false, userRole: "", user: null })
        );

        toast.add({
          severity: "error",
          summary: "Session Expired",
          detail: "Please log in again.",
          life: 3000,
        });
        throw new Error("Session expired");
      }
    }
    const data = await response.json();
    toast.add({
      severity: "error",
      summary: "Session Expired",
      detail: data.message,
      life: 3000,
    });
  }

  return response;
};

const refreshToken = async () => {
  try {
    const response = await fetch(
      "http://localhost:8080/hostel_management_system_web/api/auth/refresh",
      {
        method: "POST",
        credentials: "include",
      }
    );

    return response.ok;
  } catch (err) {
    return false;
  }
};

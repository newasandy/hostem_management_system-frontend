import { ref } from "vue";
import { useToast } from "primevue";
import { fetchAuthentication } from "./fetchAuthentication";

export const getUserDetails = () => {
  const users = ref([]);
  const userRole = ref([]);
  const totalRecords = ref(0);
  const toast = useToast();
  const userData = async (payload) => {
    const response = await fetchAuthentication(
      "http://localhost:8080/hostel_management_system_web/api/user/table",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
      toast
    );
    if (response.ok) {
      const data = await response.json();
      users.value = data.user_list;
      totalRecords.value = data.count;
    }
  };

  const getUserRole = async () => {
    const response = await fetchAuthentication(
      "http://localhost:8080/hostel_management_system_web/api/user/userType",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
      toast
    );
    if (response.ok) {
      const data = await response.json();
      userRole.value = data;
    }
  };

  const registerUser = async (payload) => {
    try {
      const response = await fetchAuthentication(
        "http://localhost:8080/hostel_management_system_web/api/auth/register",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
        toast
      );

      if (response.ok) {
        const data = await response.json();
        toast.add({
          severity: "success",
          summary: "Register Successful",
          detail: data.message,
          life: 3000,
        });

        return true;
      }
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Network Error",
        detail: "Could not reach server",
        life: 3000,
      });
      return false;
    }
  };

  const updateUser = async (payload) => {
    try {
      const response = await fetchAuthentication(
        "http://localhost:8080/hostel_management_system_web/api/user/updateUser",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
        toast
      );

      if (!response.ok) {
        const data = await response.json();
        toast.add({
          severity: "error",
          summary: "Not Update",
          detail: data.message,
          life: 3000,
        });
        return;
      }
      const data = await response.json();
      toast.add({
        severity: "success",
        summary: "Update Successful",
        detail: data.message,
        life: 3000,
      });
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Network Error",
        detail: "Could not reach server",
        life: 3000,
      });
      return false;
    }
  };

  return {
    users,
    userRole,
    totalRecords,
    userData,
    getUserRole,
    registerUser,
    updateUser,
  };
};

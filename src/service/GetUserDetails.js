import { ref } from "vue";

export const getUserDetails = () => {
  const user = ref([]);

  const userData = async () => {
    const response = await fetch(
      "http://localhost:8080/hostel_management_system_web/api/user/table",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      user.value = data;
    }
  };

  return { user, userData };
};

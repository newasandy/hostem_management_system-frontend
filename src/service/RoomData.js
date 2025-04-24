import { ref } from "vue";

export const roomData = () => {
  const room = ref([]);

  const getAvailableRoom = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/hostel_management_system_web/api/rooms/availableRoom",
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
        room.value = data;

        console.log("fetch room data");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return { room, getAvailableRoom };
};

import { ref } from "vue";
import { fetchAuthentication } from "./fetchAuthentication";
export const roomData = () => {
  const room = ref([]);
  const roomTotalRecords = ref(0);

  const getAvailableRoom = async (payload) => {
    try {
      const response = await fetchAuthentication(
        "http://localhost:8080/hostel_management_system_web/api/rooms/availableRoom",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        room.value = data.available_room;
        roomTotalRecords.value = data.count;
      }
    } catch (error) {
      console.log(error);
    }
  };
  return { room, roomTotalRecords, getAvailableRoom };
};

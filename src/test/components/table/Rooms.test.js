import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import PrimeVue from "primevue/config";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
// import RoomDataTable from "./RoomDataTable.vue";
import Rooms from "../../../components/tables/Rooms.vue";

const sampleData = [
  { id: 1, roomNumber: 101, capacity: 1, status: true },
  { id: 2, roomNumber: 102, capacity: 3, status: true },
  { id: 4, roomNumber: 103, capacity: 3, status: true },
  { id: 6, roomNumber: 105, capacity: 4, status: true },
];

describe("Rooms.vue", () => {
  const factory = (props = {}) =>
    mount(Rooms, {
      global: {
        plugins: [PrimeVue, createTestingPinia()],
        components: { DataTable, Column, InputText },
      },
      props: {
        value: sampleData,
        totalRecords: sampleData.length,
        rows: 5,
        loading: false,
        ...props,
      },
    });

  it("renders all rooms when no filters applied", () => {
    const wrapper = factory();
    const rows = wrapper.findAll("tbody tr");
    expect(rows.length).toBe(4);
    expect(rows[0].text()).toContain("101");
    expect(rows[1].text()).toContain("102");
  });

  //   it("filters rooms by room number", async () => {
  //     const wrapper = factory();
  //     const filterInput = wrapper.find('input[placeholder="Search names"]');
  //     await filterInput.setValue("101");
  //     await filterInput.trigger("keydown.enter");

  //     const rows = wrapper.findAll("tbody tr");
  //     expect(rows.length).toBe(1);
  //     expect(rows[0].text()).toContain("101");
  //   });

  //   it("emits sort event when column header clicked", async () => {
  //     const wrapper = factory();
  //     const roomNumberHeader = wrapper.findAll(".p-sortable-column")[0];
  //     await roomNumberHeader.trigger("click");

  //     const lazyEvents = wrapper.emitted("lazy");
  //     expect(lazyEvents).toBeTruthy();
  //     expect(lazyEvents[0][0].sortField).toBe("roomNumber");
  //   });

  it("paginates results correctly", async () => {
    const wrapper = factory({ rows: 2 });
    const paginatorInfo = wrapper.find(".p-paginator-current");
    expect(paginatorInfo.text()).toContain("1 to 2 of 4");
  });

  //   it("emits action event when row button clicked", async () => {
  //     const wrapper = factory();
  //     const firstRowButton = wrapper.findComponent({ name: "TableRowButton" });
  //     await firstRowButton.trigger("click");

  //     const actionEvents = wrapper.emitted("action");
  //     expect(actionEvents).toBeTruthy();
  //     expect(actionEvents[0][0].roomNumber).toBe(101);
  //   });

  it("shows loading spinner when loading prop is true", () => {
    const wrapper = factory({ loading: true });
    expect(wrapper.find(".pi-spinner").exists()).toBe(true);
  });

  it("displays empty message when no data", () => {
    const wrapper = factory({ value: [] });
    expect(wrapper.text()).toContain("No users found.");
  });

  //   it("updates status display correctly", () => {
  //     const modifiedData = [{ ...sampleData[0], status: false }];
  //     const wrapper = factory({ value: modifiedData });
  //     const statusSpan = wrapper.find("span");
  //     expect(statusSpan.text()).toBe("Deactive");
  //     expect(statusSpan.classes()).toContain("text-red-600");
  //   });
});

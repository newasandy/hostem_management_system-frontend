import { mount, config } from "@vue/test-utils";
import { describe, it, expect, beforeEach } from "vitest";
import MyButton from "../../../components/UI/MyButton.vue";
import TableRowButton from "../../../components/UI/TableRowButton.vue";

// Stub PrimeVue Button globally so we can inspect props/emits without pulling in PrimeVue’s implementation
config.global.stubs = {
  Button: {
    props: ["type", "label", "severity"],
    emits: ["click"],
    template: `
      <button
        :data-type="type"
        :data-label="label"
        :data-severity="severity"
        @click="$emit('click', $event)"
      >
        {{ label }}
      </button>
    `,
  },
};

describe("MyButton.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(MyButton, {
      props: {
        type: "submit",
        label: "Save",
        color: "success",
      },
    });
  });

  it("forwards `type`, `label`, and `severity` props to PrimeVue Button", () => {
    const btn = wrapper.find("button");
    expect(btn.attributes("data-type")).toBe("submit");
    expect(btn.attributes("data-label")).toBe("Save");
    expect(btn.attributes("data-severity")).toBe("success");
  });

  it("renders the label text", () => {
    expect(wrapper.text()).toBe("Save");
  });

  it("emits `click` with the native event when clicked", async () => {
    await wrapper.find("button").trigger("click");
    const emitted = wrapper.emitted("click");
    expect(emitted).toHaveLength(1);
    expect(emitted[0][0]).toBeInstanceOf(Event);
  });
});

describe("TableRowButton.vue", () => {
  let wrapper;
  const props = {
    icon: "row-icon",
    size: "w-6 h-6",
    colorScheme: "text-blue-500 bg-white",
    customClasses: "extra-class",
    position: "right-1",
  };

  beforeEach(() => {
    wrapper = mount(TableRowButton, { props });
  });

  it("renders <i> with provided icon class", () => {
    const iconEl = wrapper.find("i");
    expect(iconEl.classes()).toContain(props.icon);
  });

  it("applies computed classes correctly", () => {
    const btn = wrapper.find("button");
    // computed classes only: size, colorScheme, customClasses, position
    props.size.split(" ").forEach((c) => expect(btn.classes()).toContain(c));
    props.colorScheme
      .split(" ")
      .forEach((c) => expect(btn.classes()).toContain(c));
    expect(btn.classes()).toContain(props.customClasses);
    expect(btn.classes()).toContain(props.position);
  });

  it("applies static template classes correctly", () => {
    const btn = wrapper.find("button");
    const staticClasses = [
      "absolute",
      "top-1/2",
      "transform",
      "-translate-y-1/2",
      "translate-x-full",
      "opacity-0",
      "group-hover:translate-x-0",
      "group-hover:opacity-100",
      "transition-all",
      "duration-300",
      "p-2",
      "rounded-full",
      "shadow-lg",
    ];
    staticClasses.forEach((c) => expect(btn.classes()).toContain(c));
  });

  it("emits `action` when clicked", async () => {
    await wrapper.find("button").trigger("click");
    const emitted = wrapper.emitted("action");
    expect(emitted).toHaveLength(1);
  });
});

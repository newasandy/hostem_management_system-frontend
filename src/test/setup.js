import PrimeVue from "primevue/config";

PrimeVue.install = (app) => {
  app.config.globalProperties.$primevue = {
    config: {
      aria: {
        pagination: {
          root: "Pagination",
          pageLabel: (page) => `Page ${page}`,
          nextPageLabel: "Next",
          previousPageLabel: "Previous",
          firstPageLabel: "First",
          lastPageLabel: "Last",
        },
      },
    },
  };
};

export default PrimeVue;

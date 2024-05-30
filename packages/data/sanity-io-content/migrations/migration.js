import { defineMigration, at, unset } from "sanity/migrate";

export default defineMigration({
  title: "Test Migration",
  documentTypes: ["resumeCompany"],
  migrate: {
    object() {
      return [at("logo", unset())];
    },
  },
});

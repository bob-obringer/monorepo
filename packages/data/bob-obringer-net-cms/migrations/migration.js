import { defineMigration, at, setIfMissing, unset } from "sanity/migrate";

export default defineMigration({
  title: "Change the movie object field to film",
  documentTypes: ["resumeIndustry"],
  migrate: {
    object(doc) {
      return [at("name", setIfMissing(doc.category)), at("industry", unset())];
    },
  },
});

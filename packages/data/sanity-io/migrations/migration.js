// import { defineMigration, at, setIfMissing, unset } from "sanity/migrate";
//
// export default defineMigration({
//   title: "Test Migration",
//   documentTypes: ["resumeIndustry"],
//   migrate: {
//     object(doc) {
//       return [at("name", setIfMissing(doc.category)), at("industry", unset())];
//     },
//   },
// });

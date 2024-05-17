import { ResumeCompany } from "@/services/sanity-io/resume-company-helpers";
import { Text } from "@bob-obringer/design-system";

export function Skills({ company }: { company: ResumeCompany }) {
  // this is terrible, I need to load sorted categories differently
  const categorizedSkills =
    company.highlights?.reduce(
      (acc, { skills }) => {
        skills?.forEach(({ name, category }) => {
          const categoryName = category?.name;
          const orderRank = category?.orderRank ?? null;
          if (!name || !categoryName) return;
          const categoryIndex = acc.findIndex(
            (item) => item.name === categoryName,
          );
          if (categoryIndex === -1) {
            acc.push({
              name: categoryName,
              skills: new Set([name]),
              orderRank,
            });
          } else {
            acc[categoryIndex].skills.add(name);
          }
        });
        return acc;
      },
      [] as Array<{
        name: string;
        skills: Set<string>;
        orderRank: string | null;
      }>,
    ) ?? [];

  // Sort the categories based on the orderRank
  categorizedSkills.sort(
    (a, b) => a.orderRank?.localeCompare(b?.orderRank ?? "") ?? 0,
  );

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
      {categorizedSkills.map(({ name: category, skills }) => (
        <div key={category} className="space-y-1">
          <Text as="h4" variant="label-small" color="tertiary">
            {category}
          </Text>
          <Text variant="body-medium">{Array.from(skills).join(", ")}</Text>
        </div>
      ))}
    </div>
  );
}

import { ResumeCompany } from "@/features/sanity-io/queries/resume-company";
import { Text } from "@bob-obringer/design-system";

function isNotNull<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

type Skills = Array<Skill>;

export function CompanySkills({ company }: { company: ResumeCompany }) {
  const skills: Skills = company.highlights
    ?.flatMap(({ skills }) => skills as Skills)
    .reduce((unique, skill) => {
      if (!unique.find((obj) => obj.name === skill.name)) {
        unique.push(skill);
      }
      return unique;
    }, [] as Skills);

  return <ExperienceSkills skills={skills} />;
}

export function ExperienceSkills({ skills }: { skills: Skills }) {
  const categorizedSkills = getCategorizedSkills(skills);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
      {categorizedSkills.map(({ name, skills }) => (
        <div key={name} className="space-y-1">
          <Text as="h4" variant="label-small" color="tertiary">
            {name}
          </Text>
          <Text variant="body-medium">{Array.from(skills).join(", ")}</Text>
        </div>
      ))}
    </div>
  );
}

type Skill = {
  name: string;
  category: {
    name: string;
  };
};

type CategorizedSkill = {
  name: string;
  skills: Set<string>;
};

export function getCategorizedSkills(
  skills: Array<Skill>,
): Array<CategorizedSkill> {
  return skills.filter(isNotNull).reduce(
    (acc, { name, category }) => {
      const categoryName = category.name;

      const existingCategory = acc.find((item) => item.name === categoryName);
      if (!existingCategory) {
        acc.push({
          name: categoryName,
          skills: new Set([name]),
        });
      } else {
        existingCategory.skills.add(name);
      }
      return acc;
    },
    [] as Array<{
      name: string;
      skills: Set<string>;
    }>,
  );
}

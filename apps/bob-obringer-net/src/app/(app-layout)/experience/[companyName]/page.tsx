import json from "@/features/resume/data.json";
import { Text } from "@bob-obringer/design-system";

export default function ResumePage({
  params,
}: {
  params: { companyName: string };
}) {
  const work = json.work.find(
    (w) => w.name.toLowerCase() === params.companyName.toLowerCase(),
  );
  if (!work) return <div>Company not found</div>;

  return (
    <>
      <Text as="h3" variant="title-large">
        {work.company}
      </Text>
      <Text as="h4" variant="title-medium" color="secondary">
        {work.position}
      </Text>
      <Text variant="title-small" color="secondary">
        {work.startDate} - {work.endDate}
      </Text>
      <ul className="space-y-4 pt-5">
        {work.highlights.map((highlight, index) => (
          <Text
            as="li"
            variant="body-medium"
            key={index}
            className="text-pretty"
          >
            {highlight}
          </Text>
        ))}
      </ul>
    </>
  );
}

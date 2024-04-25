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
    <div className="space-y-4">
      <div>
        <Text as="h3" variant="title-large">
          {work.company}
        </Text>
        <Text as="h4" variant="title-medium" color="secondary">
          {work.position}
        </Text>
        <Text variant="title-small" color="secondary">
          {work.startDate.substring(0, 4)} -{" "}
          {work.endDate ? work.endDate.substring(0, 4) : "Present"}
        </Text>
      </div>
      <hr className="h-px border-0 bg-[#ffffff22]" />
      <Text as="div" variant="body-small" className="text-pretty">
        {work.summary}
      </Text>
      <hr className="h-px border-0 bg-[#ffffff22]" />
      <ul className="space-y-4">
        {work.highlights.map((highlight, index) => (
          <Text
            as="li"
            variant="body-medium"
            key={index}
            className="text-pretty"
          >
            {highlight.split("[")[0]}
          </Text>
        ))}
      </ul>
    </div>
  );
}

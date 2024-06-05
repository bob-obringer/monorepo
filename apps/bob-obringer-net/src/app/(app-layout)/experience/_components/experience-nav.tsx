import { cx } from "@bob-obringer/design-system";
import { ExperienceList } from "@/app/(app-layout)/experience/_components/experience-list";
import { getResumeCompanies } from "@/features/sanity-io/queries/resume-company";

export async function ExperienceNav({ className }: { className?: string }) {
  const resumeCompanies = await getResumeCompanies();

  return (
    <nav
      className={cx(
        className,
        "mx-auto w-full max-w-md overflow-scroll pl-2 has-[>_.flex-row]:max-w-full md:max-w-md lg:pl-0",
      )}
    >
      <ExperienceList resumeCompanies={resumeCompanies} />
    </nav>
  );
}

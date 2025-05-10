import { cn } from "@/helpers/cn";
import { getResumeCompanies } from "@/integrations/sanity-io/queries/resume-company";
import { ExperienceNavListItem } from "@/app/experience/_components/experience-nav-list-item";
import { getDocument } from "@/services/sanity-io-client";

export async function ExperienceNav({ className }: { className?: string }) {
  const aboutBob = await getDocument("aboutBob");
  const resumeCompanies = await getResumeCompanies();

  return (
    <nav
      className={cn(
        "flex w-full overflow-y-auto px-5 lg:mx-auto lg:max-w-full",
        "lg:max-w-md lg:flex-col lg:px-0",
        className,
      )}
    >
      <ul className={cn("flex h-auto items-center", "lg:h-20")}>
        <ExperienceNavListItem
          url={"/experience"}
          slug=""
          title={"Background"}
          subtitle={aboutBob?.title}
        />
      </ul>
      <Divider className="ml-1 lg:ml-0" />
      <ul
        className={cn(
          "flex flex-row space-x-1 px-1",
          "lg:flex-col lg:space-x-0 lg:space-y-1 lg:px-0 lg:py-1",
        )}
      >
        {resumeCompanies.map((company) => (
          <ExperienceNavListItem
            key={company.slug}
            slug={company.slug}
            title={company.name}
            subtitle={company.position}
            url={`/experience/${company.slug}`}
          />
        ))}
      </ul>
      <Divider className="mr-1 lg:mb-1 lg:mr-0" />
      <ul className={cn("flex h-auto items-center")}>
        <ExperienceNavListItem
          url={"https://api.obringer.net/resume"}
          title={"Resume / CV"}
          subtitle={"Download PDF"}
          target={"_blank"}
        />
      </ul>
    </nav>
  );
}

function Divider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border-color-tertiary w-px border-r",
        "lg:h-px lg:w-auto lg:border-b lg:border-r-0",
        className,
      )}
    />
  );
}

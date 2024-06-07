import { cx } from "@bob-obringer/design-system";
import { getResumeCompanies } from "@/features/sanity-io/queries/resume-company";
import { ExperienceNavListItem } from "@/app/(app-layout)/experience/_components/experience-nav-list-item";
import { getDocument } from "@/services/sanity-io-client";

export async function ExperienceNav({ className }: { className?: string }) {
  const aboutBob = await getDocument("aboutBob");
  const resumeCompanies = await getResumeCompanies();

  return (
    <nav
      className={cx(
        "mx-auto flex w-full max-w-full overflow-scroll px-5",
        "md:max-w-md md:flex-col md:px-0",
        className,
      )}
    >
      <ul className={cx("flex h-auto items-center", "md:h-20")}>
        <ExperienceNavListItem
          url={"/experience"}
          slug=""
          title={"Background"}
          subtitle={aboutBob?.title}
        />
      </ul>
      <Divider className="ml-1 md:ml-0" />
      <ul
        className={cx(
          "flex flex-row space-x-1 px-1",
          "md:flex-col md:space-x-0 md:space-y-1 md:px-0 md:py-1",
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
      <Divider className="mr-1 md:mb-1 md:mr-0" />
      <ul className={cx("flex h-auto items-center")}>
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
      className={cx(
        "border-color-tertiary w-px border-r",
        "md:h-px md:w-auto md:border-b md:border-r-0",
        className,
      )}
    />
  );
}

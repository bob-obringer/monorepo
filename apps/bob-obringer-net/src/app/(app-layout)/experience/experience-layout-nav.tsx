import { cx, Text } from "@bob-obringer/design-system";
import resume from "@/features/resume/data.json";
import { ReactNode, useEffect, useState } from "react";
import { useBobObringerAi } from "@/features/ai/bob-obringer-ai-context";
import NextLink from "next/link";

function debounce<F extends (...args: never[]) => unknown>(
  func: F,
  delay: number,
) {
  let debounceTimer: number | undefined;
  return (...args: Parameters<F>): ReturnType<F> | void => {
    clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(() => func(...args), delay);
  };
}

export function ExperienceLayoutNav({
  selectedCompany,
}: {
  selectedCompany?: string;
}) {
  const [navLeft, setNavLeft] = useState<number | null>(null);

  const handleResize = debounce(() => {
    const padding = Math.max((window.innerWidth - 768 - 192 - 30) / 2, 10);
    setNavLeft(padding);
  }, 5);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    handleResize();
  }, [handleResize, selectedCompany]);

  return (
    <nav
      style={{ left: `${navLeft}px` }}
      className={
        selectedCompany
          ? cx(
              navLeft === null ? "hidden" : "",
              "overflow-x-auto px-2",
              "md:fixed md:bottom-0 md:left-0 md:top-0 md:w-48 md:overflow-y-auto md:px-0 md:pb-44 md:pt-28",
            )
          : "flex flex-col items-center"
      }
    >
      {!selectedCompany && <ExperienceSubTitle />}
      <ExperienceList selectedCompany={selectedCompany} />
    </nav>
  );
}

function ExperienceList({ selectedCompany }: { selectedCompany?: string }) {
  return (
    <ul
      className={cx(
        "flex px-2",
        "md:flex-col md:space-y-1 md:px-0",
        selectedCompany
          ? "flex-row space-x-1 md:space-x-0"
          : "w-full max-w-md flex-col",
      )}
    >
      {resume.work.map((job, index) => {
        const isSelected = selectedCompany === job.name;
        return (
          <li
            key={`${job.company}:${index}`}
            className={cx(
              "min-w-36 p-2",
              isSelected
                ? "rounded bg-[#112840] outline outline-1 -outline-offset-1 outline-[#154467] transition-colors"
                : "",
            )}
          >
            <ExperienceItemLink href={`/experience/${job.name.toLowerCase()}`}>
              <Text
                as="div"
                variant={selectedCompany ? "body-medium" : "body-large"}
                className="line-clamp-1 transition-all duration-300"
              >
                {job.company}
              </Text>
              <Text
                as="div"
                variant={selectedCompany ? "body-small" : "body-medium"}
                color="secondary"
                className="line-clamp-1"
              >
                {job.position}
              </Text>
            </ExperienceItemLink>
          </li>
        );
      })}
    </ul>
  );
}

function ExperienceSubTitle() {
  return (
    <Text
      as="div"
      variant="body-medium"
      color="tertiary"
      className="pb-4 pt-2 text-center"
    >
      <i>
        {`You can press an experience item below, but it's more`}
        <br />
        {`fun to `}
        <span className="text-color-secondary">
          learn about Bob using the AI assistant below
        </span>{" "}
      </i>
    </Text>
  );
}

function ExperienceItemLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const { close } = useBobObringerAi();

  return (
    <NextLink
      href={href}
      onClick={close}
      className="text-color-link hover:text-color-link-hover transition-colors duration-300 ease-in-out"
    >
      {children}
    </NextLink>
  );
}

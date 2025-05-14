import { ExperiencePageBody } from "@/app/(public)/experience/_layout/experience-page-body";

export function BodyTextLoader() {
  return (
    <div className="bg-foreground/15 mb-2 h-5 w-full animate-pulse rounded" />
  );
}

export function BodyTextSmallLoader() {
  return (
    <div className="bg-foreground/15 mb-1 h-4 w-full animate-pulse rounded" />
  );
}

export function ExperienceLoading({ hideHeader }: { hideHeader?: boolean }) {
  return (
    <ExperiencePageBody
      title={
        !hideHeader && (
          <div className="bg-foreground/15 mb-1 h-8 w-64 animate-pulse rounded" />
        )
      }
      subtitle={
        !hideHeader && (
          <div className="bg-foreground/15 h-5 w-96 animate-pulse rounded" />
        )
      }
      body={
        <>
          <BodyTextLoader />
          <BodyTextLoader />
          <BodyTextLoader />
          <BodyTextLoader />
          <BodyTextLoader />
          <br />
          <BodyTextLoader />
          <BodyTextLoader />
          <br />
          <BodyTextLoader />
          <BodyTextLoader />
          <BodyTextLoader />
        </>
      }
      sidebar={
        <>
          <BodyTextSmallLoader />
          <BodyTextSmallLoader />
          <BodyTextSmallLoader />
          <br />
          <BodyTextSmallLoader />
          <BodyTextSmallLoader />
          <BodyTextSmallLoader />
        </>
      }
    />
  );
}

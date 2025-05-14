import { ExperiencePageBody } from "@/app/(public)/experience/_layout/experience-page-body";

export function BodyTextLoader() {
  return (
    <div className="bg-foreground/25 mb-2 h-5 w-full animate-pulse rounded-full" />
  );
}

export function BodyTextSmallLoader() {
  return (
    <div className="bg-foreground/25 mb-1 h-4 w-full animate-pulse rounded-full" />
  );
}

export function ExperienceLoading({ hideHeader }: { hideHeader?: boolean }) {
  return (
    <ExperiencePageBody
      title={
        !hideHeader && (
          <div className="bg-foreground/25 mb-1 h-8 w-64 animate-pulse rounded-lg" />
        )
      }
      subtitle={
        !hideHeader && (
          <div className="bg-foreground/25 h-5 w-96 animate-pulse rounded-full" />
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

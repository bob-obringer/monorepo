import { ExperiencePageBody } from "@/app/(app-layout)/experience/_layout/experience-page-body";

export function BodyTextLoader() {
  return <div className="bg-color-tertiary mb-2 h-5 w-full rounded-full" />;
}

export function BodyTextSmallLoader() {
  return <div className="bg-color-tertiary mb-1 h-4 w-full rounded-full" />;
}

export function ExperienceLoading({ hideHeader }: { hideHeader?: boolean }) {
  return (
    <ExperiencePageBody
      title={
        !hideHeader && (
          <div className="bg-color-tertiary mb-1 h-8 w-64 rounded-lg" />
        )
      }
      subtitle={
        !hideHeader && (
          <div className="bg-color-tertiary h-5 w-96 rounded-full" />
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

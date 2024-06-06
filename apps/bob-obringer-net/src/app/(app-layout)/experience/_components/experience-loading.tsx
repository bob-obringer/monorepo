import { ExperiencePageBody } from "@/app/(app-layout)/experience/_layout/experience-page-body";

export function BodyTextLoader() {
  return <div className="bg-color-secondary mb-2 h-5 w-full rounded-full" />;
}

export function BodyTextSmallLoader() {
  return <div className="bg-color-secondary mb-1 h-4 w-full rounded-full" />;
}

export function ExperienceLoading() {
  return (
    <ExperiencePageBody
      title={<div className="bg-color-secondary mb-1 h-8 w-64 rounded-lg" />}
      subtitle={<div className="bg-color-secondary h-5 w-96 rounded-full" />}
      body={
        <>
          <BodyTextLoader />
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

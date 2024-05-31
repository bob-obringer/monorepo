import { MiniCard } from "@/components/mini-card";

export function ResumeCard() {
  return (
    <MiniCard
      href="https://api.obringer.net/resume"
      label="PDF"
      text={"Bob's Resume"}
      iconName="faFileLines"
    />
  );
}

export function ResumeLinkCard() {
  return (
    <MiniCard
      href="https://bob.obringer.net/resume"
      label="Web"
      text={"Bob's Experience Page"}
      iconName="faHistory"
    />
  );
}

import { MiniCard } from "@/components/mini-card";

export function ResumeCard() {
  return (
    <MiniCard
      href="https://api.obringer.net/resume"
      label="PDF"
      text={"Download Bob's Resume"}
      iconName="FileLines"
    />
  );
}

export function ResumeLinkCard() {
  return (
    <MiniCard
      href="https://bob.obringer.net/resume"
      label="Web"
      text={"View Bob's Experience"}
      iconName="History"
    />
  );
}

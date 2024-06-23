import { MiniCard } from "@/components/mini-card";
import { faFileLines } from "@awesome.me/kit-8a94ae437c/icons/sharp/solid";
import { faBookUser } from "@awesome.me/kit-8a94ae437c/icons/duotone/solid";

export function ResumeCard() {
  return (
    <MiniCard
      href="https://api.obringer.net/resume"
      label="PDF"
      text={"Download Bob's Resume"}
      icon={faFileLines}
    />
  );
}

export function ResumeLinkCard() {
  return (
    <MiniCard
      href="https://bob.obringer.net/resume"
      label="Web"
      text={"View Bob's Experience"}
      icon={faBookUser}
    />
  );
}

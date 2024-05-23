import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from "@fortawesome/free-solid-svg-icons";
import { Text } from "@bob-obringer/design-system";

export function ResumeCard() {
  return (
    <a
      href="https://private-bob-obringer-net.s3.amazonaws.com/resume/bob-obringer-resume.pdf"
      target="_blank"
      className="flex w-full max-w-72 items-center gap-4 rounded border border-[#ffffff11] bg-[#ffffff11] px-4 py-2"
    >
      <FontAwesomeIcon size="2x" width="2rem" icon={icons[`faFileLines`]} />
      <div>
        <Text as="div" variant="label-small" color="secondary">
          Resume
        </Text>
        <Text as="div" variant="body-large">
          Bob Obringer
        </Text>
      </div>
    </a>
  );
}

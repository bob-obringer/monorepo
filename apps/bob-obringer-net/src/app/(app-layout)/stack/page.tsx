import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bob Obringer - Stack",
  description: "Bob's Tech Stack",
};

export default function StackPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center pt-20">
      <Image
        src="/under-construction.gif"
        alt="Under Construction"
        unoptimized
        width={100}
        height={100}
      />
    </div>
  );
}

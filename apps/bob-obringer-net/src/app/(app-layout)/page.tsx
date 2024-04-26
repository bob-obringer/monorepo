import { Text } from "@bob-obringer/design-system";

// const bio = [
//   `I'm a software engineer with over 25 years of experience crafting web
//   solutions. My expertise lies in front-end development, but I'm also
//   well-versed in the art of full-stack creation.`,
//   `Throughout my career, I've witnessed the evolution of front-end
//   development firsthand. From the early days of the web, when HTML, CSS,
//   and JavaScript formed the foundation, to the emergence of powerful new
//   technologies like React and NextJS, I've continually adapted and
//   expanded my skill set.`,
//   `By staying at the forefront of the ever-evolving technological
//   landscape, I find joy in building user interfaces that seamlessly
//   blend form and function, creating digital experiences that captivate
//   and engage. If you're a startup looking for a dedicated software
//   engineer to help bring your vision to life, let's join forces to
//   build the future, one line of code at a time.`,
// ];

const bio = [
  `Software architect and product engineer with over 25 years of
  experience crafting sophisticated web applications.
  My expertise lies in front-end development, but I'm 
  well-versed throughout the stack.`,
  `I've witnessed the evolution of the web
  firsthand, from the early days, when HTML, CSS,
  and JavaScript formed the foundation, to the emergence of powerful new
  technologies like TypeScript, React, NextJS and Tailwind.`,
  `By staying at the forefront of the ever-evolving technological
  landscape, I find joy in building user interfaces that seamlessly
  blend form and function, creating engaging and captivating experiences.`,
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-screen-sm flex-col text-balance px-5 pt-5 md:pt-24">
      <Text
        as="h1"
        variant="display-medium"
        className="md:typography-display-large mb-4"
      >
        Bob Obringer
      </Text>
      <Text as="h2" variant="headline-large" color="secondary" className="mb-8">
        Software Architect
      </Text>
      {bio.map((paragraph, index) => (
        <Text key={index} as="p" variant="body-large" className="mb-4">
          {paragraph}
        </Text>
      ))}
    </main>
  );
}

import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

const content = [
  {
    title: "Search through Course Catalog",
    description:
      "Have you ever wondered what classes are available? PolyLink can help you find the right classes for you. You can search through the course catalog to find the classes you are interested in by giving a description of what you are looking for.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <img
          src="/imgs/splash/course-catalog.gif"
          alt="linear board demo"
          width={500}
          height={500}
        />
      </div>
    ),
  },
  {
    title: "Find the right Club for you",
    description:
      "Search through 400+ clubs Cal Poly has to offer. PolyLink can help you find the right club. We use your provided interests to find the clubs that are the best fit for you.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <img
          src="/imgs/splash/calpoly-clubs.gif"
          width={500}
          height={500}
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "Find a Professor",
    description:
      "Utilizing ratings from Polyratings, PolyLink can help you find the right professor for you. Simply type the course name and PolyLink will summarize all professors teaching that course and their ratings.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <img
          src="/imgs/splash/professor-ratings.gif"
          width={500}
          height={500}
          alt="linear board demo"
        />
      </div>
    ),
  },
];

export function StickyScrollRevealDemo() {
  return <StickyScroll content={content} />;
}

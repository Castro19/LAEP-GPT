import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

const content = [
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
    title: "Find Your Spring 2025 Classes with AI",
    description:
      "Struggling to find the perfect class? PolyLink makes it easy! Just describe what you're looking for, and our smart search will instantly find the best course options for you—no more endless scrolling through the catalog!",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <img
          src="/imgs/splash/course-ai-query.gif"
          alt="linear board demo"
          width={680}
          height={382}
        />
      </div>
    ),
  },
  {
    title: "Build Your Perfect Schedule!",
    description:
      "You’ve picked your classes—now let Schedule Builder handle the rest! Generate multiple schedule options, resolve conflicts, and customize with ease. Say goodbye to scheduling stress!",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <img
          src="/imgs/splash/build-schedules.gif"
          alt="linear board demo"
          width={680}
          height={382}
        />
      </div>
    ),
  },
  {
    title: "From Planning to AI-Powered Insights!",
    description:
      "You’ve selected your classes and generated schedules—now let AI summarize, analyze, and optimize! Get instant summaries, professor insights, and smart suggestions to help you make the most of Spring 2025.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <img
          src="/imgs/splash/schedule-builder-ai.gif"
          alt="linear board demo"
          width={680}
          height={382}
        />
      </div>
    ),
  },
  // {
  //   title: "Find a Professor",
  //   description:
  //     "Utilizing ratings from Polyratings, PolyLink can help you find the right professor for you. Simply type the course name and PolyLink will summarize all professors teaching that course and their ratings.",
  //   content: (
  //     <div className="h-full w-full flex items-center justify-center text-white">
  //       <img
  //         src="/imgs/splash/professor-ratings.gif"
  //         width={500}
  //         height={500}
  //         alt="linear board demo"
  //       />
  //     </div>
  //   ),
  // },
];

export function StickyScrollRevealDemo() {
  return <StickyScroll content={content} />;
}

import { StickyScroll } from "../ui/sticky-scroll-reveal";

const content = [
  {
    title: "Matching Assistants",
    description:
      "Here are assistants available to guide you during your time at Cal Poly. More will be added periodically to expand support. All assistants operate via the OpenAI API, providing tailored assistance as you explore various resources and opportunities. Our goal is to ensure you have comprehensive guidance across all areas.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <img
          src="/imgs/splash/Student.svg"
          alt="linear board demo"
          width={400}
          height={400}
        />
      </div>
    ),
  },
  {
    title: "Find a Senior Project Advisor",
    description:
      "Track your project progress live. With our platform, each change is updated instantly, so you’re always in sync with the latest modifications. Forget versioning headaches and enjoy seamless, real-time updates for a clear, collaborative project experience.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <img
          src="/imgs/splash/teacher-matching.png"
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
      "Stay up to date effortlessly. Our platform automatically keeps your project’s latest version accessible to everyone, eliminating manual updates. Keep your team coordinated and workflow steady with our real-time sync, leaving no room for missed updates or version confusion.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <img
          src="/imgs/splash/multiple-assistants.png"
          width={500}
          height={500}
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "Find other Students",
    description:
      "Enjoy worry-free project management with real-time updates that ensure you’re always viewing the latest version. Forget manual updates and focus on seamless collaboration as our platform keeps everyone aligned on the most current progress, free of interruptions.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <img
          src="/imgs/splash/teacher-matching.png"
          width={500}
          height={500}
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "Find Classes",
    description:
      "Get real-time updates that free you from managing version control manually. Work with confidence, knowing that your team is always working on the latest version. Keep progress steady, streamline teamwork, and stay on top of every change effortlessly.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <img
          src="/imgs/splash/teacher-matching.png"
          alt="linear board demo"
          width={500}
          height={500}
        />
      </div>
    ),
  },
];

export function StickyScrollRevealDemo() {
  return (
    <div className="">
      <StickyScroll content={content} />
    </div>
  );
}

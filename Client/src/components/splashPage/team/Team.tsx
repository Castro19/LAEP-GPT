import PersonCard from "./PersonCard";

const teamMembers = [
  {
    name: "Cristian Castro Oliva",
    role: "Founder / Head of Engineering",
    desc: "Hello! I'm Cristian, a Computer Science student at CalPoly SLO. I'm passionate about building software applications that solve real problems. My focus is on full stack development, with a special interest in creating engaging front-end experiences.",
    funFact: "I am extremely good at Super Smash Bros. Ultimate.",
    image: "/images/team/cristian.jpg",
    linkedin: "https://www.linkedin.com/in/cristian-castro-oliva/",
    github: "https://github.com/Castro19",
  },
];
const Team = () => {
  return (
    <div className="w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input dark:bg-zinc-80">
      <div className="flex flex-col items-center justify-center space-y-10 min-w-full">
        {teamMembers.map((member) => (
          <PersonCard
            key={member.name}
            name={member.name}
            role={member.role}
            desc={member.desc}
            funFact={member.funFact}
            image={member.image}
            linkedin={member.linkedin}
            github={member.github}
          />
        ))}
      </div>
    </div>
  );
};

export default Team;

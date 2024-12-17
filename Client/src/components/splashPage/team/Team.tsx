import { TeamDocument } from "@polylink/shared/types";
import PersonCard from "./PersonCard";

const Team = ({ teamMembers }: { teamMembers: TeamDocument[] }) => {
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

import { TeamDocument } from "@polylink/shared/types";
import PersonCard from "./PersonCard";
import { Helmet } from "react-helmet";

const Team = ({ teamMembers }: { teamMembers: TeamDocument[] }) => {
  return (
    <>
      <Helmet>
        <title>Our Team | PolyLink</title>
        <meta name="description" content="Meet the talented team behind PolyLink." />
        
        {/* OpenGraph Image Tags */}
        <meta property="og:title" content="Our Team | PolyLink" />
        <meta property="og:image" content="/seo-polylink.png" />
        <meta property="og:description" content="Meet the talented team behind PolyLink." />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/seo-polylink.png" />
        <meta name="twitter:title" content="Our Team | PolyLink" />
        <meta name="twitter:description" content="Meet the talented team behind PolyLink." />
      </Helmet>
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
    </>
  );
};

export default Team;

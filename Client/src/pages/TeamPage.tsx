import SplashLayout from "@/components/layout/splashPage/SplashLayout";
import JoinTeam from "@/components/splashPage/team/JoinTeam";
import Team from "@/components/splashPage/team/Team";
import { TeamDocument } from "@polylink/shared/types";
import { useLoaderData } from "react-router-dom";

const TeamPage = () => {
  const teamMembers = useLoaderData() as TeamDocument[];
  return (
    <SplashLayout>
      <JoinTeam />
      <Team teamMembers={teamMembers} />
    </SplashLayout>
  );
};

export default TeamPage;

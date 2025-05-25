import { Card } from "@/components/ui/card";
import { TeamDocument } from "@polylink/shared/types";

type ContributorCardProps = {
  name: string;
  role: string;
};

const ContributorCard = ({ name, role }: ContributorCardProps) => {
  return (
    <Card className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
      <span className="font-medium">{name}</span>
      <span className="text-sm text-muted-foreground">{role}</span>
    </Card>
  );
};

const Contributors = ({
  type,
  teamMembers,
}: {
  type: "Contributor" | "Previous Contributor";
  teamMembers: TeamDocument[];
}) => {
  return (
    <div className="w-2/3 space-y-2">
      <h3 className="dark:text-white text-lg font-semibold mb-4">
        {type === "Contributor" ? "Contributors" : "Previous Contributors"}
      </h3>
      <div className="grid gap-2">
        {teamMembers.map((contributor) => (
          <ContributorCard
            key={contributor.name}
            name={contributor.name}
            role={contributor.role}
          />
        ))}
      </div>
    </div>
  );
};

export default Contributors;

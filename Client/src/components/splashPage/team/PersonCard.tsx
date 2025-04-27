import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";

type PersonCardProps = {
  name: string;
  role: string;
  desc: string;
  image: string;
  funFact: string;
  linkedin: string;
  github?: string;
};

const PersonCard = ({
  name,
  role,
  desc,
  image,
  funFact,
  linkedin,
  github,
}: PersonCardProps) => {
  const handleLinkClick = (url: string) => {
    window.open(url, "_blank");
  };
  return (
    <BackgroundGradient className="rounded-[22px] max-w-sm sm:p-10 bg-card dark:bg-zinc-900 min-w-[80vw]">
      <Card className="rounded-[22px] flex flex-col justify-between space-y-4 w-full h-full bg-card dark:bg-zinc-900 p-4">
        <div className="flex items-center justify-start space-x-4">
          <Avatar>
            <AvatarImage src={image} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle>{name}</CardTitle>
          <Button
            onClick={() => handleLinkClick(linkedin)}
            className="dark:bg-transparent"
            variant="outline"
            size="icon"
          >
            <FaLinkedin className="size-5" />
          </Button>
          {github && (
            <Button
              onClick={() => handleLinkClick(github)}
              className="dark:bg-transparent"
              variant="outline"
              size="icon"
            >
              <FaGithub className="size-5" />
            </Button>
          )}
        </div>
        <CardDescription>{role}</CardDescription>

        <p className="text-sm text-neutral-600 dark:text-neutral-400">{desc}</p>

        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          <strong>Fun Fact:</strong> {funFact}
        </p>
      </Card>
    </BackgroundGradient>
  );
};

export default PersonCard;

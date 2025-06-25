import { TeamDocument } from "@polylink/shared/types";
import PersonCard from "./PersonCard";
import { Helmet } from "react-helmet-async";
import Contributors from "./Contributors";

/**
 * Team - Main team page component for displaying team members
 *
 * This component renders the complete team page with founder, team members,
 * contributors, and previous contributors. It includes SEO optimization
 * and proper organization of different team member types.
 *
 * @component
 * @param {Object} props - Component props
 * @param {TeamDocument[]} props.teamMembers - Array of team member data
 *
 * @example
 * ```tsx
 * <Team teamMembers={teamData} />
 * ```
 *
 * @dependencies
 * - TeamDocument type from shared types
 * - PersonCard for individual member display
 * - Contributors for contributor sections
 * - React Helmet for SEO
 *
 * @features
 * - Categorizes team members by type
 * - Displays founder prominently
 * - Shows current team members
 * - Lists contributors separately
 * - Includes previous contributors
 * - SEO optimization with meta tags
 *
 * @teamCategories
 * - Founder: Single prominent display
 * - Team: Current team members (excluding contributors)
 * - Contributors: Active contributors
 * - Previous Contributors: Past contributors
 *
 * @seo
 * - Page title: "Our Team | PolyLink"
 * - Meta description for team page
 * - OpenGraph tags for social sharing
 * - Twitter Card tags for Twitter sharing
 * - Custom image for social media
 *
 * @layout
 * - Responsive design with rounded corners
 * - Proper spacing between sections
 * - Centered content layout
 * - Shadow effects for depth
 *
 * @styling
 * - Dark theme with zinc background
 * - Rounded corners on larger screens
 * - Proper padding and spacing
 * - Shadow input styling
 * - Responsive design
 *
 * @accessibility
 * - Semantic HTML structure
 * - Proper heading hierarchy
 * - Screen reader friendly content
 * - Keyboard navigation support
 * - Alt text for images
 */
const Team = ({ teamMembers }: { teamMembers: TeamDocument[] }) => {
  const founder = teamMembers.find(
    (member) => member.name === "Cristian Castro Oliva"
  );
  const team = teamMembers.filter(
    (member) =>
      member.type !== "Contributor" &&
      member.type !== "Previous Contributor" &&
      member.type !== "Founder"
  );
  const contributors = teamMembers.filter(
    (member) => member.type === "Contributor"
  );
  const previousContributors = teamMembers.filter(
    (member) => member.type === "Previous Contributor"
  );

  return (
    <>
      <Helmet>
        <title>Our Team | PolyLink</title>
        <meta
          name="description"
          content="Meet the talented team behind PolyLink."
        />

        {/* OpenGraph Image Tags */}
        <meta property="og:title" content="Our Team | PolyLink" />
        <meta
          property="og:image"
          content="https://polylink.dev/seo-polylink.png"
        />
        <meta
          property="og:description"
          content="Meet the talented team behind PolyLink."
        />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://polylink.dev/seo-polylink.png"
        />
        <meta name="twitter:title" content="Our Team | PolyLink" />
        <meta
          name="twitter:description"
          content="Meet the talented team behind PolyLink."
        />
      </Helmet>
      <div className="w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input dark:bg-zinc-80">
        <div className="flex flex-col items-center justify-center space-y-10 min-w-full">
          {founder && (
            <PersonCard
              key={founder.name}
              name={founder.name}
              role={founder.role}
              desc={founder.desc}
              funFact={founder.funFact}
              image={founder.image}
              linkedin={founder.linkedin}
              github={founder.github}
              type="Founder"
            />
          )}
          {team.map((member) => (
            <PersonCard
              key={member.name}
              name={member.name}
              role={member.role}
              desc={member.desc}
              funFact={member.funFact}
              image={member.image}
              linkedin={member.linkedin}
              github={member.github}
              type={member.type}
            />
          ))}
          {contributors.length > 0 && (
            <Contributors type="Contributor" teamMembers={contributors} />
          )}
          {previousContributors.length > 0 && (
            <Contributors
              type="Previous Contributor"
              teamMembers={previousContributors}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Team;

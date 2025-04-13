import SplashLayout from "@/components/layout/splashPage/SplashLayout";
import AboutSection from "@/components/splashPage/about/AboutSection";
import { Helmet } from "react-helmet";

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About PolyLink</title>
        <meta
          name="description"
          content="Learn more about the team behind PolyLink and our mission to support Cal Poly students with AI tools."
        />

        {/* OpenGraph Image Tags */}
        <meta property="og:image" content="/seo-about.png" />
        <meta property="og:title" content="About PolyLink" />
        <meta
          property="og:description"
          content="Learn more about the team behind PolyLink and our mission to support Cal Poly students with AI tools."
        />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/seo-about.png" />
        <meta name="twitter:title" content="About PolyLink" />
        <meta
          name="twitter:description"
          content="Learn more about the team behind PolyLink and our mission to support Cal Poly students with AI tools."
        />
      </Helmet>
      <SplashLayout>
        <AboutSection />
      </SplashLayout>
    </>
  );
};

export default AboutPage;

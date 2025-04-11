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
        <meta property="og:image" content="/seo-about.png" />
      </Helmet>
      <SplashLayout>
        <AboutSection />
      </SplashLayout>
    </>
  );
};

export default AboutPage;

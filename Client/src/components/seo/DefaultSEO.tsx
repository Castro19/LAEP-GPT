import { Helmet } from "react-helmet";

const DefaultSEO = () => {
  return (
    <Helmet>
      {/* Updated Title */}
      <title>PolyLink - Your AI Chatbot for Cal Poly SLO</title>
      <meta 
        name="description"
        content="PolyLink is your one-stop AI-powered solution for navigating Cal Poly student life."
      />
      <meta
        property="og:title"
        content="PolyLink - Your AI Chatbot for Cal Poly SLO"
      />
      <meta
        property="og:description"
        content="Discover PolyLink at polylink.dev—an AI-powered chatbot for Cal Poly SLO students. Find courses, explore clubs, view professor ratings, and get your campus questions answered fast."
      />
      <meta property="og:image" content="/seo-polylink.png" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://polylink.dev" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="PolyLink - Your AI Chatbot for Cal Poly SLO"
      />
      <meta
        name="twitter:description"
        content="Discover PolyLink at polylink.dev—an AI chatbot for Cal Poly SLO students. Find courses, explore clubs, view professor ratings, and get your campus questions answered fast."
      />
      <meta name="twitter:image" content="/seo-polylink.png" />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Website",
          "name": "PolyLink",
          "url": "https://polylink.dev",
          "description": "Discover PolyLink at polylink.dev—an AI-powered chatbot for Cal Poly SLO students. Find courses, explore clubs, view professor ratings, and get your campus questions answered fast.",
          "image": "https://polylink.dev/seo-polylink.png"
        })}
      </script>
    </Helmet>
  );
};

export default DefaultSEO;
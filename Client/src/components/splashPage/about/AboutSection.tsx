import { motion } from "framer-motion";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";
import text from "./aboutText";

const md = new MarkdownIt();

const AboutSection = () => {
  // Create an array of section data
  const sections = [
    { text: text.introText, videoId: "HlPKFzQB5l4?si=2CXaLndC7wTLlHaQ" },
    { text: text.aboutText, videoId: "zMBJrFnoJRw?si=hjCTai-WQtSg0Go5" },
    { text: text.flowchartText, videoId: "pUXRDrsNco8?si=wPSLEFeZd_x1xH8X" },
    { text: text.courseSearchText, videoId: "MYXE1Yx4MJU?si=6CQh8Etid8jiPIQD" },
    {
      text: text.scheduleBuilderText,
      videoId: "fjd6oeoiT4A?si=8OPMFnOSAf1-RXKm",
    },
    {
      text: text.scheduleInsightsText,
      videoId: "yo-UKQzNCec?si=bD0jrYZ3quL-oOZo",
    },
    { text: text.conclusionText, videoId: null },
  ];

  return (
    <div className="flex items-center justify-center w-full h-full bg-slate-900 min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0"
      >
        <svg
          className="absolute top-0 left-0 w-1/2 h-1/2"
          viewBox="0 0 200 200"
          fill="none"
        >
          <path
            d="M0 0H142.5L0 142.5V0Z"
            fill="url(#gradient1)"
            fillOpacity="0.2"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
        </svg>
        <svg
          className="absolute bottom-0 right-0 w-1/2 h-1/2"
          viewBox="0 0 200 200"
          fill="none"
        >
          <path
            d="M200 200H57.5L200 57.5V200Z"
            fill="url(#gradient2)"
            fillOpacity="0.2"
          />
          <defs>
            <linearGradient id="gradient2" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#6ee7b7" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-6xl mx-auto px-4 py-20"
      >
        {sections.map((section, index) => {
          const safeHtml = DOMPurify.sanitize(md.render(section.text), {
            ADD_ATTR: ["target", "rel"],
          });

          return (
            <div key={index} className="mb-20">
              {/* Text Content */}
              <div className="prose prose-invert prose-lg prose-headings:font-bold prose-headings:bg-gradient-to-r prose-headings:from-gray-300 prose-headings:to-gray-400 prose-headings:bg-clip-text prose-headings:text-transparent prose-a:text-gray-300 prose-a:transition-all prose-a:hover:text-gray-200 prose-ul:list-none prose-li:pl-0 prose-li:before:hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 * index }}
                  dangerouslySetInnerHTML={{ __html: safeHtml }}
                />
              </div>

              {/* YouTube Video */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 * index }}
                className="mt-8"
              >
                {section.videoId && (
                  <iframe
                    className="w-full aspect-video max-w-[800px] rounded-lg shadow-lg mx-auto"
                    src={`https://www.youtube.com/embed/${section.videoId}`}
                    title="YouTube demo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </motion.div>
            </div>
          );
        })}

        {/* Animated Decorative Elements */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-16 flex justify-center space-x-8"
        >
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              whileHover={{ scale: 1.1 }}
              className="w-24 h-24 bg-slate-800 rounded-xl backdrop-blur-sm bg-opacity-50 border border-slate-700 shadow-lg flex items-center justify-center"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full" />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Subtle Dot Pattern Background */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #4f4f4f 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
    </div>
  );
};

export default AboutSection;

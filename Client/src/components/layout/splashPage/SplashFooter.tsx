const SplashFooter = () => {
  return (
    <footer className="bg-slate-900 text-white p-8 border-t-2 border-zinc-800 dark:border-x-gray-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold">PolyLink</h3>
          <p className="text-gray-300">
            Your personalized AI advisor helping Cal Poly students navigate
            their academic journey.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Quick Links</h3>
          <div className="flex flex-col space-y-2">
            <button className="text-gray-300 hover:text-white text-left">
              Engineering
            </button>
            <button className="text-gray-300 hover:text-white text-left">
              About
            </button>
            <button className="text-gray-300 hover:text-white text-left">
              FAQ
            </button>
          </div>
        </div>

        {/* Contact Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Contact</h3>
          <div className="flex flex-col space-y-2 text-gray-300">
            <a href="mailto:support@polylink.com" className="hover:text-white">
              support@polylink.com
            </a>
          </div>
        </div>
      </div>
      {/* Copyright */}
      <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-gray-400">
        <p>© {new Date().getFullYear()} PolyLink. All rights reserved.</p>
        {/* Attach LinkedIn Profile on my name */}
        <p>
          Made by{" "}
          <a
            href="https://www.linkedin.com/in/cristian-castro-oliva/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cristian Castro Oliva
          </a>
        </p>
        <p>
          & the{" "}
          <a
            href="https://polylink.dev/team"
            target="_blank"
            rel="noopener noreferrer"
          >
            PolyLink Team
          </a>
        </p>
      </div>
    </footer>
  );
};

export default SplashFooter;

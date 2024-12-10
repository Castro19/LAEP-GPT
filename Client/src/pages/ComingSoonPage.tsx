import SplashLayout from "@/components/layout/splashPage/SplashLayout";

const ComingSoonPage = () => {
  return (
    <SplashLayout>
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input dark:bg-zinc-80 my-20">
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3">
            <svg
              className="w-8 h-8 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 className="font-bold text-2xl text-center text-neutral-800 dark:text-neutral-200">
            Coming Soon!
          </h2>

          <p className="text-neutral-600 dark:text-neutral-400 text-center">
            We&apos;re working hard to bring you something amazing. This page
            will be available soon. Stay tuned for updates!
          </p>
        </div>
      </div>
    </SplashLayout>
  );
};

export default ComingSoonPage;

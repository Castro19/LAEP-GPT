const SplashHeader = () => {
  return (
    <header className="sticky top-0 bg-slate-900 text-white p-4 z-50 border-b-2 border-zinc-800 dark:border-x-gray-500 shadow-md">
      <div className="flex items-center justify-between">
        <button className="text-lg hover:text-gray-300">PolyLink</button>
        <div className="flex items-center space-x-12 mr-6">
          <button className="text-lg hover:text-gray-300">Engineering</button>

          <button className="text-lg hover:text-gray-300">About</button>
          <button className="text-lg hover:text-gray-300">FAQ</button>
        </div>
      </div>
    </header>
  );
};

export default SplashHeader;

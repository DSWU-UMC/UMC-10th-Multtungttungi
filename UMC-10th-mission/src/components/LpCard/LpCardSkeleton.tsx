const LpCardSkeleton = () => {
  return (
    <div className="group relative aspect-square rounded-md bg-[#121212] overflow-hidden border border-gray-900 shadow-md animate-pulse">
      <div className={"bg-gray-300 w-full h-48"} />
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-2">
        <div className="bg-gray-400 h-4 w-3/4 rounded-sm" />
      </div>
    </div>
  );
};

export default LpCardSkeleton;

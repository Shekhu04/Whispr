const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        {/* Animated grid pattern */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              aria-hidden="true"
              className={`aspect-square rounded-2xl bg-primary/10 transition-opacity duration-500 ${
                i % 2 === 0 ? "animate-pulse" : "opacity-75"
              }`}
            />
          ))}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 text-base-content">{title}</h2>

        {/* Subtitle */}
        <p className="text-base-content/60 leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;

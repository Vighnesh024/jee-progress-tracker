import React, { useState, useEffect } from "react";

const LoadingAnimation = () => {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "AIR 1";
  const [dotCount, setDotCount] = useState(0);

  // Typing effect for "AIR 1"
  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) {
        clearInterval(typingInterval);
      }
    }, 300);
    return () => clearInterval(typingInterval);
  }, []);

  // Bouncing dots animation (0 to 3 dots)
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDotCount((prev) => (prev === 3 ? 0 : prev + 1));
    }, 500);
    return () => clearInterval(dotsInterval);
  }, []);

  // Gradient shimmer animation via CSS class
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
        {displayedText}
        <span className="inline-block w-4">
          {".".repeat(dotCount)}
        </span>
      </h2>

      <style jsx>{`
        @keyframes gradient-x {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingAnimation;

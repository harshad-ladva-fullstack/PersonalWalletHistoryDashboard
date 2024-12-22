"use client";

interface LoadingProps {
  text?: string;
  size?: "small" | "medium" | "large";
  fullScreen?: boolean;
  className?: string;
}

const Loading = ({
  text = "Loading...",
  size = "medium",
  fullScreen = true,
  className = "",
}: LoadingProps) => {
  const spinnerSizes = {
    small: "w-8 h-8 border-2",
    medium: "w-12 h-12 border-4",
    large: "w-16 h-16 border-4",
  };

  const containerClasses = fullScreen
    ? "min-h-screen w-full flex items-center justify-center"
    : "w-full flex items-center justify-center";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <div
          className={`${spinnerSizes[size]} border-gray-200 border-t-blue-500 rounded-full animate-spin`}
        />
        {text && <p className="text-gray-500 text-lg">{text}</p>}
      </div>
    </div>
  );
};

export default Loading;

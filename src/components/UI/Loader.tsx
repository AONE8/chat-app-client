import { FC } from "react";

interface LoaderProps {
  colorScheme?: "accent" | "success";
  size?: 6 | 12 | 18 | 24;
}

const Loader: FC<LoaderProps> = ({ colorScheme = "accent", size = 18 }) => {
  const colorSchemeObject = {
    accent: "text-accent",
    success: "text-success",
  };

  const sizeObject = {
    6: "w-6",
    12: "w-12",
    18: "w-18",
    24: "w-24",
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <span
        className={`loading loading-spinner ${colorSchemeObject[colorScheme]} ${sizeObject[size]}`}
      ></span>
    </div>
  );
};

export default Loader;

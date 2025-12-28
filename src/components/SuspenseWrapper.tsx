import { Suspense } from "react";
import AnimatedLogoLoader from "./UI/AnimatedLogoLoader";

const SuspenseWrapper = ({ element }: { element: React.ReactNode }) => {
  return (
    <Suspense
      fallback={<AnimatedLogoLoader className="chatapp-layout-loader" />}
    >
      {element}
    </Suspense>
  );
};

export default SuspenseWrapper;

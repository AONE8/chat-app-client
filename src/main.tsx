import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import AnimatedLogoLoader from "./components/UI/AnimatedLogoLoader";

const App = lazy(() => import("@/App.tsx"));

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<AnimatedLogoLoader className="chatapp-layout-loader" />}>
    <App />
  </Suspense>
);

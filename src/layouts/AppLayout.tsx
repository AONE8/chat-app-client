import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import { type RootState } from "@/store";

import useRefetchToken from "@/hooks/useRefetchToken";
import AnimatedLogoLoader from "@/components/UI/AnimatedLogoLoader";

const AppLayout = () => {
  const isRefreshingToken = useSelector(
    (state: RootState) => state.auth.isRefreshingToken
  );
  useRefetchToken();

  return isRefreshingToken ? (
    <AnimatedLogoLoader className="chatapp-layout-loader" />
  ) : (
    <Outlet />
  );
};

export default AppLayout;

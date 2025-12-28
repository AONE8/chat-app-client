import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@store";

import { refreshTokenAction } from "@store/authActions";
import { isExpired } from "react-jwt";

const useRefetchToken = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch<AppDispatch>();

  const isTokenValid = !!token && !isExpired(token.raw);

  useLayoutEffect(() => {
    if (!isTokenValid) dispatch(refreshTokenAction());
  }, [isTokenValid, dispatch]);
};

export default useRefetchToken;

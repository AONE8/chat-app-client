import { createBrowserRouter, Navigate } from "react-router-dom";

import ProtectedRoute from "@pages/ProtectedRoute";
import SomePage from "@pages/SomePage";
import ErrorPage from "@/pages/ErrorPage";
import AnimatedLogoLoader from "@/components/UI/AnimatedLogoLoader";
import UserLayout from "@/layouts/UserLayout";
import Chat from "@/pages/Chat/Chat";
import Profile from "@/pages/Profile";
import Group from "@/pages/Group/Group";
import User from "@/pages/User/User";
import Auth from "@/pages/Auth/Auth";
import AppLayout from "@/layouts/AppLayout";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    errorElement: <ErrorPage />,
    element: <AppLayout />,
    hydrateFallbackElement: (
      <AnimatedLogoLoader className="chatapp-layout-loader" />
    ),
    children: [
      {
        id: "auth",
        path: "/auth",
        element: <Auth />,
      },
      {
        id: "gateway",
        element: <ProtectedRoute />,
        children: [
          {
            id: "user-layout",
            path: "/user",
            element: <UserLayout />,
            children: [
              {
                id: "chat",
                path: "chats/:chatId",
                element: <Chat />,
              },
              {
                id: "group",
                path: "groups/:groupId",
                element: <Group />,
              },
              {
                id: "profile",
                path: "profile",
                element: <Profile />,
              },
              {
                id: "user",
                path: "users/:userId",
                element: <User />,
              },
              {
                id: "user-wildcard-redirect",
                path: "*",
                element: <Navigate to="/user" />,
              },
            ],
          },
        ],
      },
      {
        path: "some-experiments",
        element: <SomePage />,
      },
      {
        id: "root-redirect",
        index: true,
        element: <Navigate to="/auth" />,
      },
      {
        id: "root-wildcard-redirect",
        path: "*",
        element: <Navigate to="/auth" />,
      },
    ],
  },
]);

export default router;

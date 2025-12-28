import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { type RootState } from "@store";

import { activityStatus } from "@contents/userProfileContent";

const UserHeader = ({
  name,
  isOnline,
}: {
  name: string;
  isOnline?: boolean;
}) => {
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";

  return (
    <header className="chatapp-header">
      <p className="chatapp-link-back">
        <Link to="/user">
          <ChevronLeft />
        </Link>
      </p>
      <h1>{name}</h1>
      <p className="text-xs">
        {isOnline === undefined || isOnline === null
          ? activityStatus.unknown[lang]
          : isOnline
          ? activityStatus.online[lang]
          : activityStatus.offline[lang]}
      </p>
    </header>
  );
};

export default UserHeader;

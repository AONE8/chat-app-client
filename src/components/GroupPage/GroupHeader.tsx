import { FC } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react";

import { type RootState } from "@store";

import { userOnlineStatus } from "@contents/userContent";
import { chatMembers } from "@contents/chatContent";

interface GroupHeaderProps {
  title: string;
  memberCount: number;
  activeMembersCount?: number;
}

const GroupHeader: FC<GroupHeaderProps> = ({
  title,
  memberCount,
  activeMembersCount,
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
      <h1>{title}</h1>
      <p className="text-xs">
        {`${memberCount} ${chatMembers[lang]}`}
        {!!activeMembersCount &&
          `, ${activeMembersCount} ${userOnlineStatus[lang]}`}
      </p>
    </header>
  );
};

export default GroupHeader;

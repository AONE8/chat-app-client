import { FC } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Settings } from "lucide-react";

import { type RootState } from "@store";

import { userOnlineStatus, userUknownStatus } from "@contents/userContent";

interface AsideHeaderProps {
  name?: string;
  alias?: string;
  avatarUrl?: string;
  isOnline?: boolean;
}

const AsideHeader: FC<AsideHeaderProps> = ({
  name,
  alias,
  avatarUrl,
  isOnline,
}) => {
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";

  return (
    <header className="aside-header shadow-bottom">
      <h1 className="heading-1">{name ?? ""}</h1>
      <p className="text-xs">{alias ? `@${alias}` : ""}</p>
      <div className="aside-header-bottom">
        <span className="relative pr-2">
          <span>
            {isOnline ? userOnlineStatus[lang] : userUknownStatus[lang]}
          </span>
          <span className="ping-container">
            <span className="relative flex size-3">
              {isOnline && <span className="ping-ring"></span>}
              <span
                className={`ping-inner-circle ${
                  isOnline ? "bg-sky-500" : "bg-gray-400"
                }`}
              ></span>
            </span>
          </span>
        </span>
        <div className="aside-avatar">
          <div className="aside-image-container image-placeholder-24 ">
            {!avatarUrl && <span>{name?.charAt(0).toUpperCase()}</span>}
            {avatarUrl && <img src={avatarUrl} alt={name} loading="lazy" />}
          </div>
        </div>
      </div>
      <p className="settings-container">
        <Link to="/user/profile" className="settings-link">
          <Settings />
        </Link>
      </p>
    </header>
  );
};

export default AsideHeader;

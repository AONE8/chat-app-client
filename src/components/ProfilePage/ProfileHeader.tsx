import { useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { type RootState } from "@store";

import { profileTitle } from "@contents/profileContent";

const ProfileHeader = () => {
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";

  return (
    <header className="chatapp-header">
      <p className="chatapp-link-back">
        <Link to="/user">
          <ChevronLeft />
        </Link>
      </p>
      <h1 className="row-span-2">{profileTitle[lang]}</h1>
    </header>
  );
};

export default ProfileHeader;

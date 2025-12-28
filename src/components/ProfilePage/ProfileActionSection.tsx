import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { type AppDispatch, type RootState } from "@store";

import { logoutAction } from "@store/authActions";
import { actionBtnLabels } from "@contents/profileContent";

interface ProfileActionSectionProps {
  onDelete: () => void;
}

const ProfileActionSection: FC<ProfileActionSectionProps> = ({ onDelete }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const lang =
    useSelector((state: RootState) => state.user?.profile?.language) ?? "en";
  const appDispatch = useDispatch<AppDispatch>();

  async function handleLogout() {
    setIsLoggingOut(true);
    await appDispatch(logoutAction());

    setIsLoggingOut(false);
  }

  return (
    <section className="chatapp-action-section">
      <button
        className="btn btn-outline btn-secondary"
        disabled={isLoggingOut}
        onClick={handleLogout}
      >
        {actionBtnLabels.logout[lang]}
      </button>
      <button className="btn btn-outline btn-error" onClick={onDelete}>
        {actionBtnLabels.delete[lang]}
      </button>
    </section>
  );
};

export default ProfileActionSection;

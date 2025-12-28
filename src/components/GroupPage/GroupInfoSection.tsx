import { FC } from "react";
import ImageHolder from "../UI/ImageHolder";

interface GroupInfoSectionProps {
  avatarUrl?: string;
  name: string;
  alias?: string;
}

const GroupInfoSection: FC<GroupInfoSectionProps> = ({
  avatarUrl,
  name,
  alias,
}) => {
  return (
    <section className="chatapp-info-section">
      <ImageHolder
        className="pr-4"
        username={name}
        avatarUrl={avatarUrl}
        size={24}
      />
      <div className="info-part">
        <h2 className="username">{name}</h2>

        {alias && <p className="alias">@{alias}</p>}
      </div>
    </section>
  );
};

export default GroupInfoSection;

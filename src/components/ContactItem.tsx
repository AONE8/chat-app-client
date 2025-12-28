import { Link } from "react-router-dom";
import ImageHolder from "./UI/ImageHolder";

interface ContactItemProps {
  id: string;
  name: string;
  alias?: string;
  avatarUrl?: string;
  isOnline?: boolean;
}

const ContactItem: React.FC<ContactItemProps> = ({
  name,
  alias,
  avatarUrl,
  isOnline,
  id,
}) => {
  return (
    <Link
      className="flex gap-3 p-2 border border-transparent hover:border-emerald-400 active:bg-emerald-400/60 rounded-md"
      to={"/user/users/" + id}
    >
      <ImageHolder username={name} avatarUrl={avatarUrl} isOnline={isOnline} />

      <div className="flex flex-col">
        <span className="text-lg font-semibold">{name}</span>
        {alias && <span className="text-sm text-gray-500">@{alias}</span>}
      </div>
    </Link>
  );
};

export default ContactItem;

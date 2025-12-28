import { FC } from "react";
import ImageHolder from "../UI/ImageHolder";

interface UserInfoSectionProps {
  name: string;
  alias?: string;
  avatarUrl?: string;
  email: string;
  phoneNumber?: string;
}

const UserInfoSection: FC<UserInfoSectionProps> = ({
  name,
  alias,
  avatarUrl,
  email,
  phoneNumber,
}) => {
  return (
    <section className="w-full lg:w-128 lg:mx-auto flex divide-emerald-500 divide-x-2 gap-4 border rounded-2xl p-2">
      <ImageHolder
        className="pr-4"
        username={name}
        avatarUrl={avatarUrl}
        size={24}
      />

      <div className="max-w-3/5 flex-1/2 flex flex-col gap-2">
        <h2 className="text-2xl border-b border-transparent truncate">
          {name}
        </h2>

        {alias && (
          <p className="text-sm mb-4 border-b border-transparent">@{alias}</p>
        )}
        <p className="border-b border-transparent">{email}</p>

        {phoneNumber && (
          <p className="border-b border-transparent">{phoneNumber}</p>
        )}
      </div>
    </section>
  );
};

export default UserInfoSection;

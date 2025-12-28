import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { type UserData } from "@/types/userTypes";

import UserHeader from "@components/UserPage/UserHeader";
import UserInfoSection from "@components/UserPage/UserInfoSection";
import UserDescriptionSection from "@components/UserPage/UserDescriptionSection";
import UserActionSection from "@components/UserPage/UserActionSection";
import { getUserById } from "@api/services/userService";
import Loader from "@/components/UI/Loader";

const User = () => {
  const { userId } = useParams();

  const { data, isLoading } = useQuery<UserData, Error & { status?: number }>({
    queryKey: ["user", userId],
    queryFn: async ({ signal }) => getUserById({ userId: userId!, signal }),
  });

  if (isLoading) return <Loader />;

  return (
    <>
      <UserHeader name={data!.name} isOnline={data?.isOnline} />
      <main className="flex-grow chatapp-main">
        <UserInfoSection
          name={data!.name}
          email={data!.email}
          alias={data?.alias}
          avatarUrl={data?.avatarUrl}
          phoneNumber={data?.phoneNumber}
        />
        {data?.description && (
          <UserDescriptionSection description={data.description} />
        )}
        <UserActionSection chatId={data?.chatId} />
      </main>
    </>
  );
};

export default User;

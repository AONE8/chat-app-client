import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { type AppDispatch, type RootState } from "@store";
import { type ActionType } from "@/types/userTypes";

import {
  updateAlias,
  updateAvatar,
  updateEmail,
  updateName,
  updatePhoneNumber,
} from "../../store/userActions";
import {
  userAlias,
  userAvatar,
  userEmail,
  userName,
  userPhoneNumber,
} from "../../schemas/userSchemas";

import { userProfileData } from "../../contents/profileContent";
import AvatarUploader from "../AvatarUploader";

interface ProfileInfoSectionProps {
  state: {
    isSetUsername: boolean;
    isSetAlias: boolean;
    isSetEmail: boolean;
    isSetPhoneNumber: boolean;
    isSetDescription: boolean;
  };
  dispatch: React.ActionDispatch<[action: ActionType]>;
}

const ProfileInfoSection: FC<ProfileInfoSectionProps> = ({
  state,
  dispatch,
}) => {
  const profile = useSelector((state: RootState) => state.user?.profile);
  const lang =
    useSelector((state: RootState) => state.user?.profile?.language) ?? "en";

  const appDispatch = useDispatch<AppDispatch>();

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const result = userAvatar.safeParse({ avatar: file });

      if (result.success) {
        await appDispatch(updateAvatar({ avatar: file }));
      } else {
        toast.error(result.error.issues[0].message);
      }
    }
  }

  async function handleUsernameBlur(event: React.FocusEvent<HTMLInputElement>) {
    const username = event.target.value;

    if (username === profile!.name)
      return dispatch({ type: "TOGGLE_USERNAME" });

    const result = userName.safeParse({ username });

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return dispatch({ type: "TOGGLE_USERNAME" });
    }

    const validData = result.data;

    const promis = await appDispatch(updateName(validData));

    if (promis.meta.requestStatus === "fulfilled") {
      dispatch({ type: "TOGGLE_USERNAME" });
    }
  }

  async function handleAliasBlur(event: React.FocusEvent<HTMLInputElement>) {
    const alias = event.target.value;

    if (alias === profile?.alias) return dispatch({ type: "TOGGLE_ALIAS" });

    const result = userAlias.safeParse({ alias });

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return dispatch({ type: "TOGGLE_ALIAS" });
    }

    const validData = result.data;

    const promis = await appDispatch(updateAlias(validData));

    if (promis.meta.requestStatus === "fulfilled") {
      dispatch({ type: "TOGGLE_ALIAS" });
    }
  }

  async function handleEmailBlur(event: React.FocusEvent<HTMLInputElement>) {
    const email = event.target.value;

    if (email === profile!.email) return dispatch({ type: "TOGGLE_EMAIL" });

    const result = userEmail.safeParse({ email });

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return dispatch({ type: "TOGGLE_EMAIL" });
    }

    const validData = result.data;

    const promis = await appDispatch(updateEmail(validData));

    if (promis.meta.requestStatus === "fulfilled") {
      dispatch({ type: "TOGGLE_EMAIL" });
    }
  }

  async function handlePhoneNumberBlur(
    event: React.FocusEvent<HTMLInputElement>
  ) {
    const phoneNumber = event.target.value;

    if (phoneNumber === profile?.phoneNumber)
      return dispatch({ type: "TOGGLE_PHONE_NUMBER" });

    const result = userPhoneNumber.safeParse({ phoneNumber });

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return dispatch({ type: "TOGGLE_PHONE_NUMBER" });
    }

    const validData = result.data;

    const promis = await appDispatch(updatePhoneNumber(validData));

    if (promis.meta.requestStatus === "fulfilled") {
      dispatch({ type: "TOGGLE_PHONE_NUMBER" });
    }
  }

  return (
    <section className="chatapp-info-section">
      <AvatarUploader
        onImageUpload={handleImageChange}
        name={profile!.name}
        avatarUrl={profile?.avatarUrl}
      />
      <div className="info-part">
        {!state.isSetUsername && (
          <h2
            className="username"
            onClick={() => dispatch({ type: "TOGGLE_USERNAME" })}
          >
            {profile?.name || userProfileData.name[lang]}
          </h2>
        )}
        {state.isSetUsername && (
          <input
            type="text"
            className="text-2xl w-full border-b  border-emerald-700 focus:outline-none "
            defaultValue={profile!.name}
            placeholder={userProfileData.name[lang]}
            autoFocus
            onBlur={handleUsernameBlur}
          />
        )}

        {!state.isSetAlias && (
          <p
            className="alias"
            onClick={() => dispatch({ type: "TOGGLE_ALIAS" })}
          >
            @{profile?.alias || userProfileData.alias[lang]}
          </p>
        )}
        {state.isSetAlias && (
          <input
            type="text"
            defaultValue={profile?.alias || ""}
            placeholder={userProfileData.alias[lang]}
            autoFocus
            className="w-full border-b border-emerald-700 text-sm mb-4 focus:outline-none"
            onBlur={handleAliasBlur}
          />
        )}
        {!state.isSetEmail && (
          <p
            className="border-b border-transparent"
            onClick={() => dispatch({ type: "TOGGLE_EMAIL" })}
          >
            {profile?.email || userProfileData.email[lang]}
          </p>
        )}
        {state.isSetEmail && (
          <input
            type="email"
            className="w-full border-b border-emerald-700 focus:outline-none"
            defaultValue={profile!.email}
            placeholder={userProfileData.email[lang]}
            autoFocus
            onBlur={handleEmailBlur}
          />
        )}

        {!state.isSetPhoneNumber && (
          <p
            className="border-b border-transparent"
            onClick={() => dispatch({ type: "TOGGLE_PHONE_NUMBER" })}
          >
            {profile?.phoneNumber || userProfileData.phoneNumber[lang]}
          </p>
        )}
        {state.isSetPhoneNumber && (
          <input
            type="tel"
            className="w-full border-b border-emerald-700 focus:outline-none"
            defaultValue={profile?.phoneNumber}
            placeholder={userProfileData.phoneNumber[lang]}
            autoFocus
            onBlur={handlePhoneNumberBlur}
          />
        )}
      </div>
    </section>
  );
};

export default ProfileInfoSection;

import { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { type AppDispatch, type RootState } from "@store";
import { type ActionType } from "@/types/userTypes";

import { updateDescription } from "@store/userActions";
import { userDescription } from "@schemas/userSchemas";
import { userProfileData } from "@contents/profileContent";

interface ProfileDescSectionProps {
  state: {
    isSetUsername: boolean;
    isSetAlias: boolean;
    isSetEmail: boolean;
    isSetPhoneNumber: boolean;
    isSetDescription: boolean;
  };
  dispatch: React.ActionDispatch<[action: ActionType]>;
}

const ProfileDescSection: FC<ProfileDescSectionProps> = ({
  dispatch,
  state,
}) => {
  const [rows, setRows] = useState(1);
  const pRef = useRef<HTMLParagraphElement>(null);
  const profile = useSelector((state: RootState) => state.user?.profile);
  const lang =
    useSelector((state: RootState) => state.user?.profile?.language) ?? "en";
  const appDispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (pRef.current) {
      const lineHeight = parseFloat(
        window.getComputedStyle(pRef.current).lineHeight
      );
      const height = pRef.current.offsetHeight;
      const calculatedRows = Math.ceil(height / lineHeight);
      setRows(calculatedRows);
    }
  }, [state.isSetDescription]);

  async function handleDescriptionBlur(
    event: React.FocusEvent<HTMLTextAreaElement>
  ) {
    const description = event.target.value;

    const result = userDescription.safeParse({ description });

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return dispatch({ type: "TOGGLE_DESCRIPTION" });
    }

    if (description === profile?.description || !description)
      return dispatch({ type: "TOGGLE_DESCRIPTION" });

    const validData = result.data;

    const promis = await appDispatch(updateDescription(validData));

    if (promis.meta.requestStatus === "fulfilled") {
      dispatch({ type: "TOGGLE_DESCRIPTION" });
    }
  }

  return (
    <section className="chatapp-description-section">
      {!state.isSetDescription && (
        <p ref={pRef} onClick={() => dispatch({ type: "TOGGLE_DESCRIPTION" })}>
          {profile?.description || userProfileData.description[lang]}
        </p>
      )}
      {state.isSetDescription && (
        <textarea
          className="w-full border-none focus:outline-none resize-none"
          defaultValue={profile?.description}
          placeholder={userProfileData.description[lang]}
          autoFocus
          rows={rows}
          onBlur={handleDescriptionBlur}
        ></textarea>
      )}
    </section>
  );
};

export default ProfileDescSection;

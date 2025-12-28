import { useReducer, useRef } from "react";
import { useSelector } from "react-redux";

import { type RootState } from "@store";
import { type ActionType } from "@/types/userTypes";

import ProfileHeader from "@components/ProfilePage/ProfileHeader";
import ProfileInfoSection from "@components/ProfilePage/ProfileInfoSection";
import ProfileDescSection from "@components/ProfilePage/ProfileDescSection";
import ProfileSettingsSection from "@components/ProfilePage/ProfileSettingsSection";
import ProfileActionSection from "@components/ProfilePage/ProfileActionSection";
import DeleteUserModal from "@components/DeleteUserModal";
import Loader from "@components/UI/Loader";

const initialState = {
  isSetUsername: false,
  isSetAlias: false,
  isSetEmail: false,
  isSetPhoneNumber: false,
  isSetDescription: false,
};

const reducer = (state: typeof initialState, action: ActionType) => {
  switch (action.type) {
    case "TOGGLE_USERNAME":
      return { ...state, isSetUsername: !state.isSetUsername };
    case "TOGGLE_ALIAS":
      return { ...state, isSetAlias: !state.isSetAlias };
    case "TOGGLE_EMAIL":
      return { ...state, isSetEmail: !state.isSetEmail };
    case "TOGGLE_PHONE_NUMBER":
      return { ...state, isSetPhoneNumber: !state.isSetPhoneNumber };
    case "TOGGLE_DESCRIPTION":
      return { ...state, isSetDescription: !state.isSetDescription };
    default:
      return state;
  }
};

const Profile = () => {
  const profile = useSelector((state: RootState) => state.user?.profile);
  const [state, dispatch] = useReducer(reducer, initialState);
  const deleteModalRef = useRef<HTMLDialogElement>(null!);
  const userUpdating = useSelector(
    (state: RootState) => state.user.userUpdating
  );

  if (userUpdating || !profile) return <Loader />;

  function handleCloseModal(formEl: React.RefObject<HTMLFormElement>) {
    deleteModalRef.current.close();
    formEl.current?.reset();
  }

  function handleOpenModal() {
    deleteModalRef.current.showModal();
  }

  return (
    <>
      <ProfileHeader />
      <main className="chatapp-main">
        <DeleteUserModal ref={deleteModalRef} onClose={handleCloseModal} />
        <ProfileInfoSection state={state} dispatch={dispatch} />

        <ProfileDescSection state={state} dispatch={dispatch} />

        <ProfileSettingsSection />

        <ProfileActionSection onDelete={handleOpenModal} />
      </main>
    </>
  );
};

export default Profile;

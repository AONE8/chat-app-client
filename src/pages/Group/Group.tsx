import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSuspenseQuery } from "@tanstack/react-query";

import { type RootState } from "@store";
import { type GroupIncomingData } from "@/types/groupTypes";

import ManageGroupModal from "@components/ManageGroupModal";
import {
  GroupHeader,
  GroupAside,
  GroupInfoSection,
  GroupDescriptionSection,
  GroupForm,
  GroupMembersSection,
  GroupActionSection,
} from "@components/GroupPage/";
import ConfirmDeleteGroupModal from "@components/ConfirmDeleteGroupModal";
import { getGroup } from "@api/services/groupService";
import Loader from "@/components/UI/Loader";

const Group = () => {
  const { groupId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";
  const token = useSelector((state: RootState) => state.auth.token);
  const mngGroupModalRef = useRef<HTMLDialogElement>(null!);
  const confirmDeleteModalRef = useRef<HTMLDialogElement>(null!);
  const editFormRef = useRef<HTMLFormElement>(null!);

  const { data, isLoading } = useSuspenseQuery<GroupIncomingData>({
    queryKey: ["groups", { groupId }],
    queryFn: async ({ signal }) => getGroup({ groupId: groupId!, signal }),
  });

  if (isLoading) return <Loader />;

  const isAdmin =
    data?.members.find((m) => m.id === token?.user?.id)?.role === "admin";
  const isOwner =
    data?.members.find((m) => m.id === token?.user?.id)?.role === "owner";

  function handleOpenConfirmDeleteModal() {
    confirmDeleteModalRef.current.showModal();
  }

  return (
    <>
      <GroupHeader
        title={data?.name ?? ""}
        memberCount={data?.members.length ?? 0}
        activeMembersCount={data?.members.filter((m) => m.isOnline).length ?? 0}
      />
      {isEditing && <GroupAside editFormRef={editFormRef} />}
      <main className="relative chatapp-main flex-grow z-10">
        <ManageGroupModal
          ref={mngGroupModalRef}
          onClose={() => {
            mngGroupModalRef.current?.close();
          }}
          exceptions={data?.members.map((m) => m.id)}
          groupMembers={data?.members}
          isOwner={isOwner}
        />

        <ConfirmDeleteGroupModal
          ref={confirmDeleteModalRef}
          onClose={() => {
            confirmDeleteModalRef.current.close();
          }}
          groupName={data!.name}
        />

        {!isEditing && (
          <GroupInfoSection
            avatarUrl={data?.avatarUrl}
            name={data?.name ?? ""}
            alias={data?.alias}
          />
        )}

        {!isEditing && data?.description && (
          <GroupDescriptionSection description={data.description} />
        )}

        {isEditing && (
          <GroupForm
            ref={editFormRef}
            name={data?.name ?? ""}
            avatarUrl={data?.avatarUrl}
            alias={data?.alias}
            description={data?.description}
            setIsEditing={setIsEditing}
          />
        )}

        <GroupMembersSection
          lang={lang}
          isAdmin={isAdmin}
          isOwner={isOwner}
          mngGroupModalRef={mngGroupModalRef}
          members={data?.members ?? []}
        />

        <GroupActionSection
          chatId={data?.chatId ?? ""}
          lang={lang}
          isAdmin={isAdmin}
          isOwner={isOwner}
          groupId={groupId!}
          setIsEditing={setIsEditing}
          onDeleteGroup={handleOpenConfirmDeleteModal}
        />
      </main>
    </>
  );
};

export default Group;

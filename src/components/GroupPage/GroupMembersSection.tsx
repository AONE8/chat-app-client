import { FC } from "react";
import { LayoutGrid } from "lucide-react";

import { type Member } from "@/types/groupTypes";

import ContactItem from "@components/ContactItem";
import GroupTag from "@components/UI/GroupTag";

import { membersTitle } from "@contents/groupContent";

interface GroupMembersSectionProps {
  lang: "en" | "uk";
  isOwner: boolean;
  isAdmin: boolean;
  mngGroupModalRef: React.RefObject<HTMLDialogElement | null>;
  members: Member[];
}

const GroupMembersSection: FC<GroupMembersSectionProps> = ({
  lang,
  isAdmin,
  isOwner,
  mngGroupModalRef,
  members,
}) => {
  return (
    <section className="relative w-full lg:w-128 lg:mx-auto shrink-0 border max-h-72 px-6 py-4 rounded-2xl overflow-hidden">
      <h3 className="text-center font-semibold mb-4">{membersTitle[lang]}</h3>
      {(isOwner || isAdmin) && (
        <button
          className="absolute top-3 right-6 cursor-pointer p-2 rounded-4xl hover:bg-emerald-700/15 hover:has-[svg]:text-green-400 active:bg-emerald-500/45 transition-all duration-200"
          onClick={() => {
            mngGroupModalRef.current?.showModal();
          }}
        >
          <LayoutGrid />
        </button>
      )}
      <ul className="max-h-54 overflow-y-auto">
        {members.map((member) => (
          <li key={member.id} className="relative">
            <GroupTag role={member.role} />
            <ContactItem
              id={member.id}
              name={member.name}
              avatarUrl={member.avatarUrl}
              alias={member.alias}
              isOnline={member.isOnline}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default GroupMembersSection;

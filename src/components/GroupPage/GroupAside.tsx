import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMutationState } from "@tanstack/react-query";

import { type RootState } from "@store";

import { formEditBtn } from "@contents/groupContent";

const GroupAside = ({
  editFormRef,
}: {
  editFormRef: React.RefObject<HTMLFormElement | null>;
}) => {
  const groupId = useParams().groupId;
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";

  const [isPending] = useMutationState({
    filters: { mutationKey: ["updateGroup", groupId], status: "pending" },
    select: (state) => state.state.status === "pending",
  });
  return (
    <aside className="w-full py-1 pr-6 h-1/12 bg-green-100 flex justify-end items-center gap-4">
      <button
        type="button"
        className="btn btn-neutral"
        onClick={() => editFormRef.current?.reset()}
      >
        {formEditBtn.reject[lang]}
      </button>
      <button
        type="button"
        className="btn btn-warning disabled:btn-disabled"
        onClick={() => editFormRef.current?.requestSubmit()}
        disabled={isPending}
      >
        {isPending ? formEditBtn.editing[lang] : formEditBtn.edit[lang]}
      </button>
    </aside>
  );
};

export default GroupAside;

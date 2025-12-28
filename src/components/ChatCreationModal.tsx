import { useSelector } from "react-redux";
import { Contact, UserSearch } from "lucide-react";

import { type RootState } from "@store";

import ContactItem from "./ContactItem";
import Modal from "./UI/Modal";
import UserSearchBar from "./ModalComponents/UserSearchBar";
import useUserSearch from "@hooks/useUserSearch";
import { chatCreationModal } from "@contents/userContent";
import Loader from "./UI/Loader";

const ChatCreationModal = ({
  ref,
}: {
  ref: React.RefObject<HTMLDialogElement>;
}) => {
  const user = useSelector((state: RootState) => state.user);
  const lang = user.profile?.language;

  const [mutation, searchTerm, setSearchTerm] = useUserSearch();

  const { data, isPending, isError, error, reset, mutate } = mutation;

  function handleLinkClick(e: React.MouseEvent<HTMLUListElement>) {
    if ((e.target as HTMLElement).closest("a")) {
      ref.current?.close();
      reset();
    }
  }

  return (
    <Modal
      ref={ref}
      title={chatCreationModal.title[lang ?? "en"]}
      onClose={() => data && reset()}
    >
      <UserSearchBar
        mutate={mutate}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isPending={isPending}
      />

      {data && (
        <div className="mt-6 flex flex-col gap-3">
          <h4 className="flex gap-1.5">
            <UserSearch />
            <span>
              {chatCreationModal.searchUserResultTitle[lang ?? "en"](
                data.users.length
              )}
            </span>
          </h4>

          <ul className="chatapp-contact-list" onClick={handleLinkClick}>
            {data.users.map((user) => (
              <li key={user.alias}>
                <ContactItem
                  name={user.name}
                  alias={user.alias}
                  avatarUrl={user.avatarUrl}
                  id={user.id}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {isError && (
        <div className="text-red-500 mt-4">
          <p className="text-center">{error.message}</p>
        </div>
      )}

      {isPending && (
        <div className="text-center">
          <span className="loading loading-spinner text-accent"></span>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        <h4 className="flex gap-1.5">
          <Contact />
          <span>{chatCreationModal.contactsTitle[lang ?? "en"]}</span>
        </h4>
        {!!user.profile?.contacts?.length && (
          <ul
            className="pl-4 pr-2 flex flex-col gap-2 max-h-54 bg-emerald-400/25 rounded-lg py-3 border-2 border-double border-emerald-950 dark:border-emerald-50"
            onClick={handleLinkClick}
          >
            {user.profile.contacts.map((contact) => (
              <li key={contact.id}>
                <ContactItem
                  name={contact.name}
                  alias={contact.alias}
                  avatarUrl={contact.avatarUrl}
                  id={contact.id}
                />
              </li>
            ))}
          </ul>
        )}
        {!user.profile?.contacts?.length && (
          <p className="text-center text-gray-500">
            {chatCreationModal.contactsFallback[lang ?? "en"]}
          </p>
        )}
      </div>
    </Modal>
  );
};

export default ChatCreationModal;

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { type AppDispatch, type RootState } from "@store";

import {
  addContact,
  createChat,
  removeContact,
} from "@api/services/chatService";
import { userActions } from "@store/userSlice";
import { btnLabels } from "@contents/userProfileContent";

const UserActionSection = ({ chatId }: { chatId?: string }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const contacts = useSelector(
    (state: RootState) => state.user.profile?.contacts
  );
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";

  const isContact = contacts?.some((contact) => contact.id === userId);

  const { mutate: addContactMutate, isPending: isAddingContact } = useMutation({
    mutationFn: () => addContact({ contactId: userId! }),
    onSuccess: (data) =>
      dispatch(userActions.setContacts({ contacts: data.contacts })),
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const { mutate: removeContactMutate, isPending: isRemovingContact } =
    useMutation({
      mutationFn: () => removeContact({ contactId: userId! }),
      onSuccess: () => {
        dispatch(
          userActions.setContacts({
            contacts: contacts?.filter((contact) => contact.id !== userId),
          })
        );
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });

  const { mutate: createChatMutate, isPending: isCreatingChat } = useMutation({
    mutationFn: () => createChat({ receiverId: userId! }),
    onSuccess: (data) => {
      navigate(`/user/chats/${data.chatId}`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const hasChat = !!chatId;

  return (
    <section className="chatapp-action-section">
      {!isContact && (
        <button
          className="btn btn-outline btn-primary"
          onClick={() => addContactMutate()}
          disabled={isAddingContact || isContact}
        >
          {isAddingContact ? btnLabels.adding[lang] : btnLabels.add[lang]}
        </button>
      )}
      {isContact && (
        <button
          className="btn btn-outline btn-secondary"
          onClick={() => removeContactMutate()}
          disabled={isRemovingContact || !isContact}
        >
          {isRemovingContact
            ? btnLabels.removing[lang]
            : btnLabels.remove[lang]}
        </button>
      )}

      {!hasChat && (
        <button
          className="btn btn-outline btn-accent"
          disabled={isCreatingChat || hasChat}
          onClick={() => createChatMutate()}
        >
          {isCreatingChat
            ? btnLabels.startingChat[lang]
            : btnLabels.writeMessage[lang]}
        </button>
      )}
      {hasChat && (
        <Link
          to={`/user/chats/${chatId}`}
          className="btn btn-outline btn-accent"
        >
          {btnLabels.writeMessage[lang]}
        </Link>
      )}
    </section>
  );
};

export default UserActionSection;

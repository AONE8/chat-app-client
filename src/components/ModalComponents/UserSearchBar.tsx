import { useSelector } from "react-redux";
import { Search } from "lucide-react";

import { type RootState } from "@store";

import { searchBarPlaceholder } from "@contents/userContent";

interface UserSearchBarProps {
  mutate: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isPending: boolean;
}

const UserSearchBar: React.FC<UserSearchBarProps> = ({
  mutate,
  searchTerm,
  setSearchTerm,
  isPending,
}) => {
  const lang =
    useSelector((state: RootState) => state.user.profile?.language) ?? "en";

  const isAlias = searchTerm.startsWith("@");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!searchTerm || searchTerm.trim().length < 3) {
      return;
    }

    mutate();
  }

  return (
    <form className="flex w-full h-10 mt-4 " onSubmit={handleSubmit}>
      <input
        className={`grow pl-4 pr-2 placeholder:w-full outline-none bottom-line ${
          isAlias ? " text-emerald-400 dark:text-emerald-200" : ""
        }`}
        type="search"
        name="user"
        id="user"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={searchBarPlaceholder[lang]}
        autoFocus
      />
      <div className="">
        <button className="btn btn-primary" disabled={isPending}>
          <Search />
        </button>
      </div>
    </form>
  );
};

export default UserSearchBar;

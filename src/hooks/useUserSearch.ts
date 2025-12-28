import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

import { type ContactType } from "@/types/userTypes";

import { searchUsers } from "@api/services/userService";

const useUserSearch = (exceptions?: string[]) => {
  const [searchTerm, setSearchTerm] = useState("");

  const mutation = useMutation<{ users: ContactType[] }>({
    mutationFn: () => searchUsers({ searchTerm, exceptions }),
    onSuccess: () => setSearchTerm(""),
    mutationKey: ["searchUsers"],
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return [mutation, searchTerm, setSearchTerm] as const;
};

export default useUserSearch;

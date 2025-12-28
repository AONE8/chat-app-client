import { data } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { getUserData } from "@api/services/userService";

export async function userLayoutLoader(queryClient: QueryClient) {
  return async () => {
    await queryClient.prefetchQuery({
      queryKey: ["user"],
      queryFn: ({ signal }) => getUserData({ signal }),
    });

    return data(null, { status: 204 });
  };
}

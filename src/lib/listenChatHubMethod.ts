import { type RootState } from "@store";
import { type ChatHubListeningMethods } from "./ChatHubListeningMethods";

interface listenChatHubMethodParams {
  state: RootState;
  methods: Partial<Record<ChatHubListeningMethods, (...args: any[]) => void>>;
  caughtErrorMessage: string;
}

export const listenChatHubMethod: (
  params: listenChatHubMethodParams
) => void = ({ state, methods, caughtErrorMessage }) => {
  try {
    const connection = state.chatHub.connection;

    if (connection) {
      for (const [name, handler] of Object.entries(methods)) {
        connection.on(name, handler);
      }
    }
  } catch (error) {
    rethrowError(error, caughtErrorMessage);
  }
};

function rethrowError(error: unknown, additionalMessage: string) {
  const errorMessage = error instanceof Error ? error.message : "";

  throw new Error(errorMessage || additionalMessage);
}

import * as z from "zod";
import { groupCreationData } from "./createGroupSchema";

export const groupUpdatingData = groupCreationData.omit({ users: true });

export type groupUpdatinDataType = z.infer<typeof groupUpdatingData>;

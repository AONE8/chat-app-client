import * as z from "zod";

export const membersSchema = z
  .array(
    z
      .string("Member array accepts only string elements")
      .regex(/^[a-fA-F0-9]{24}$/, "Invalid member string"),
    "Invalid members array"
  )
  .min(1, "Members must not be empty");

export type Members = z.infer<typeof membersSchema>;

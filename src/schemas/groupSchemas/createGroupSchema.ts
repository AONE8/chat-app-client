import * as z from "zod";

export const groupCreationData = z.object({
  groupName: z
    .string("Invalid group name")
    .trim()
    .min(3, "Group name must be at least 3 characters")
    .max(30, "Group name must be at most 30 characters"),
  groupAlias: z.preprocess(
    (alias) => (alias === "" ? undefined : alias),
    z
      .string("Invalid group alias")
      .trim()
      .regex(
        /^[a-z][a-z0-9_]*$/,
        "Group alias must start with a letter and contain only lowercase letters, numbers, and underscores"
      )
      .min(3, "Group alias must be at least 3 characters")
      .max(20, "Group alias must be at most 20 characters")
      .optional()
  ),
  groupAvatar: z.preprocess(
    (avatar) => ((avatar as File | undefined)?.size === 0 ? undefined : avatar),
    z
      .file("Invalid uploaded avatar file")
      .mime(
        ["image/jpeg", "image/png", "image/webp", "image/gif"],
        "Avatar file must be an image file ('image/png', 'image/jpeg', 'image/webp', 'image/gif')"
      )
      .max(5 * 1024 * 1024, "Avatar file size must be less than 5MB")
      .optional()
  ),
  groupDescription: z.preprocess(
    (d) => (d === "" ? undefined : d),
    z
      .string("Invalid group description")
      .trim()
      .max(255, "Group description must be at most 255 characters")
      .optional()
  ),
  users: z
    .array(
      z
        .string("Users array accepts only string elements")
        .regex(/^[a-fA-F0-9]{24}$/, "Invalid user string"),
      "Invalid users array"
    )
    .min(1, "Users must not be empty"),
});

export type groupCreationDataType = z.infer<typeof groupCreationData>;

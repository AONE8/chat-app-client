import * as z from "zod";
import { Signup } from "../authSchemas/signup";

export const userName = Signup.pick({ username: true });
export type UserNameType = z.infer<typeof userName>;

export const userAlias = Signup.pick({ alias: true }).required();
export type UserAliasType = z.infer<typeof userAlias>;

export const userEmail = Signup.pick({ email: true });
export type UserEmailType = z.infer<typeof userEmail>;

export const userPhoneNumber = Signup.pick({ phoneNumber: true }).required();
export type UserPhoneNumberType = z.infer<typeof userPhoneNumber>;

export const userDescription = Signup.pick({ description: true }).required();
export type UserDescriptionType = z.infer<typeof userDescription>;

export const userAvatar = Signup.pick({ avatar: true }).required();
export type UserAvatarType = z.infer<typeof userAvatar>;

export const userPassword = Signup.pick({ password: true }).required();
export type UserPasswordType = z.infer<typeof userPassword>;

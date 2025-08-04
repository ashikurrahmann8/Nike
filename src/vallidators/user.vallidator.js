import { z } from "zod";

const userSignupSchema = z.object({
  userName: z.string().min(5),
  name: z.string().min(3),
  email: z.email(),
  password: z
    .string()
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one number and be at least 8 characters long"
    ),
});

const userSigninSchema = z.object({
  email: z.email(),
  password: z.string(),
});

const userUpdateSchema = z.object({
  userName: z.string().min(5),
  name: z.string().min(3),
  email: z.email(),
});

const userPasswordUpdateSchema = z.object({
  oldPassword: z.string(),
  newPassword: z
    .string()
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one number and be at least 8 characters long"
    ),
});

export { userSignupSchema, userSigninSchema, userUpdateSchema, userPasswordUpdateSchema };

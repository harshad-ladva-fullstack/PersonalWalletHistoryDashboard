import * as zod from "zod";

export const LoginSchema = zod.object({
  email: zod.string().email({
    message: "Invalid email address",
  }),
  password: zod
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" }),
});

export type LoginFormValues = zod.infer<typeof LoginSchema>;

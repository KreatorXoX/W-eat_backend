import { z } from "zod";

// creating a new user schema
export const registerUserSchema = z.object({
  body: z
    .object({
      name: z
        .string({ required_error: "Name is required" })
        .nonempty("Name can not be an empty string"),
      email: z.string().email().nonempty(),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Minimum of 6 Chars" }),
      confirmPassword: z
        .string({ required_error: "Confirm password is required" })
        .min(6, { message: "Minimum of 6 Chars" }),
    })
    .refine((data) => data.confirmPassword === data.password, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});
export type RegisterUserInput = z.TypeOf<typeof registerUserSchema>["body"];

// login user in schema
export const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email().nonempty(),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Minimum of 6 Chars" }),
  }),
});
export type LoginUserInput = z.TypeOf<typeof loginUserSchema>["body"];

// verifiying user via verification code schema
export const verifyUserSchema = z.object({
  params: z.object({
    id: z.string(),
    verificationCode: z.string(),
  }),
});
export type VerifyUserInput = z.TypeOf<typeof verifyUserSchema>["params"];

// change password schema
export const changePasswordSchema = z.object({
  body: z
    .object({
      id: z
        .string({ required_error: "User id is required" })
        .nonempty("User id cannot be empty string"),
      oldPassword: z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Minimum of 6 Chars" }),
      newPassword: z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Minimum of 6 Chars" }),
      confirmNewPassword: z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Minimum of 6 Chars" }),
    })
    .refine((data) => data.confirmNewPassword === data.newPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});

export type ChangePasswordInput = z.TypeOf<typeof changePasswordSchema>["body"];

// forgot password schema
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Provide a valid email address" }),
  }),
});

export type ForgotPasswordInput = z.TypeOf<typeof forgotPasswordSchema>["body"];

// reset password schema
export const resetPasswordSchema = z.object({
  params: z.object({
    id: z.string(),
    passwordResetCode: z.string(),
  }),
  body: z
    .object({
      password: z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Minimum of 6 Chars" }),
      confirmPassword: z
        .string({ required_error: "Confirm password is required" })
        .min(6, { message: "Minimum of 6 Chars" }),
    })
    .refine((data) => data.confirmPassword === data.password, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});

export type ResetPasswordInput = z.TypeOf<typeof resetPasswordSchema>;

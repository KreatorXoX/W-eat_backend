import { Response, Request, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import HttpError from "../model/http-error";

import {
  loginUser,
  registerUser,
  getGoogleOAuthTokens,
} from "../service/auth.service";
import {
  findAndUpdateUser,
  findUserById,
  findUserByMail,
} from "../service/user.service";

import {
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginUserInput,
  RegisterUserInput,
  ResetPasswordInput,
  VerifyUserInput,
} from "../schema/auth.schema";

import sendEmail from "../utils/mailer";
import { signJwt, verifyJwt } from "../utils/jwt";

interface RefreshTokenType {
  _id: string;
  exp: number;
  iat: number;
}
interface GoogleUser {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: Number;
  exp: Number;
}

export const registerUserHandler = async (
  req: Request<{}, {}, RegisterUserInput>,
  res: Response,
  next: NextFunction
) => {
  const message = "Failed to register new user";
  const body = req.body;

  const user = await registerUser(body);

  if (!user) {
    return next(new HttpError(message, 401));
  }

  await sendEmail({
    from: process.env.NODEMAILER_USER!,
    to: user.email,
    subject: "Please verify your account",
    text: `Verification code ${user.verificationCode}, Id:${user._id}`,
    html: `<a href="${process.env.BASE_URL}/auth/verify/${user._id}/${user.verificationCode}">Click to Verify your Account</a>`,
  });

  res.status(200).json({ message: "Please verify your account now!" });
};

export const loginUserHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) => {
  const message = "Invalid password or email! please check your credentials";
  const { email, password } = req.body;

  const user = await loginUser(email);

  if (!user) {
    return next(new HttpError(message, 401));
  }

  if (!user.verified) {
    return next(
      new HttpError("Verification Error - Please verify your account", 401)
    );
  }
  const match = await user.validatePassword(password);

  if (!match) {
    return next(new HttpError(message, 401));
  }

  const accessToken = signJwt(
    {
      UserInfo: {
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    },
    "accessTokenSecret",
    { expiresIn: "25s" }
  );
  const refreshToken = signJwt({ _id: user._id }, "refreshTokenSecret", {
    expiresIn: "2m",
  });

  res.cookie("myRefreshTokenCookie", refreshToken, {
    httpOnly: true,
    secure: true, // make it true when prod.
    sameSite: "none",
    maxAge: 2 * 60 * 1000,
  });

  res.json({ accessToken });
};

export const refreshUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;

  if (!cookies?.myRefreshTokenCookie) {
    return next(new HttpError("Unauthorized", 401));
  }

  const refreshToken = cookies.myRefreshTokenCookie as string;

  let decoded;
  try {
    decoded = verifyJwt<RefreshTokenType>(refreshToken, "refreshTokenSecret")!;
  } catch (error) {
    return next(new HttpError("Forbidden Route", 403));
  }

  const user = await findUserById(decoded._id);

  if (!user) return next(new HttpError("Unauthorized", 401));

  const accessToken = signJwt(
    {
      UserInfo: {
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    },
    "accessTokenSecret",
    { expiresIn: "25s" }
  );

  res.json({ accessToken });
};

export const logoutUserHandler = (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.myRefreshTokenCookie) {
    res.sendStatus(204);
    return;
  }

  res.clearCookie("myRefreshTokenCookie", {
    httpOnly: true,
    secure: true, // make it true when prod.
    sameSite: "none",
    maxAge: 2 * 60 * 1000,
  });

  res.json({ message: "Cookies cleared" });
};

export async function verifyUserHandler(
  req: Request<VerifyUserInput>,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;

  const user = await findUserById(id);

  if (!user) {
    return next(new HttpError("Could not verify the user", 500));
  }

  if (user.verified) {
    return next(new HttpError("User already verified", 400));
  }

  if (user.verificationCode !== verificationCode) {
    return next(
      new HttpError("Verification code does not match / expired", 400)
    );
  }

  user.verified = true;
  await user.save();
  res.redirect(process.env.CLIENT_BASE_URL!);
}

export async function changePasswordHandler(
  req: Request<{}, {}, ChangePasswordInput>,
  res: Response,
  next: NextFunction
) {
  const { id, oldPassword, newPassword } = req.body;

  const user = await findUserById(id);

  if (!user) {
    return next(new HttpError("User not found", 404));
  }

  if (!user.verified) {
    return next(new HttpError("User not verified", 400));
  }

  const match = await user.validatePassword(oldPassword);

  if (!match) {
    return next(new HttpError("Your credentials don't match", 401));
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: "Your password changed" }).status(200);
}

export async function forgotPasswordHandler(
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response,
  next: NextFunction
) {
  const message =
    "If a user with the provided email is registered, you will recieve a reset password link";
  const { email } = req.body;

  const user = await findUserByMail(email);

  if (!user) {
    return next(new HttpError("User not found", 404));
  }

  if (!user.verified) {
    return next(new HttpError("User not verified", 400));
  }

  const passwordResetCode = uuidv4();

  user.passwordResetCode = passwordResetCode;
  await user.save();

  await sendEmail({
    to: user.email,
    from: process.env.NODEMAILER_USER!,
    subject: "Reset your password",
    text: `Password reset link : ${passwordResetCode} ${user._id}`,
    html: `<a href="${process.env.CLIENT_BASE_URL}/reset-password/${user._id}/${user.passwordResetCode}">Click to Reset your Password</a>`,
  });

  res.status(200).json({ message });
}

export async function resetPasswordHandler(
  req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
  res: Response,
  next: NextFunction
) {
  const { id, passwordResetCode } = req.params;
  const { password } = req.body;

  const user = await findUserById(id);
  if (
    !user ||
    !user.passwordResetCode ||
    user.passwordResetCode !== passwordResetCode
  ) {
    return next(new HttpError("Could not reset the password", 400));
  }

  user.passwordResetCode = null;
  user.password = password;
  await user.save();
  res.send("Successfully updated the password");
}

export const googleOAuthHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const code = req.query.code as string;

    const { id_token } = await getGoogleOAuthTokens({ code });

    const decodedUser = jwt.decode(id_token) as JwtPayload & GoogleUser;

    if (!decodedUser.email_verified) {
      return next(new HttpError("Account is not verified", 400));
    }

    const user = await findAndUpdateUser(
      {
        email: decodedUser.email,
      },
      {
        email: decodedUser.email,
        firstName: decodedUser.given_name || decodedUser.name.split(" ")[0],
        lastName: decodedUser.family_name || decodedUser.name.split(" ")[1],
        verified: true,
        isAdmin: false,
      },
      {
        upsert: true,
        new: true,
      }
    );

    if (!user) {
      return next(new HttpError("Error registering the google user", 400));
    }
    const accessToken = signJwt(
      {
        UserInfo: {
          _id: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      },
      "accessTokenSecret",
      { expiresIn: "25s" }
    );
    const refreshToken = signJwt({ _id: user._id }, "refreshTokenSecret", {
      expiresIn: "2m",
    });

    res.cookie("myRefreshTokenCookie", refreshToken, {
      httpOnly: true,
      secure: true, // make it true when prod.
      sameSite: "none",
      maxAge: 2 * 60 * 1000,
    });

    res.redirect(
      `${process.env.CLIENT_BASE_URL!}/oauth/success?accessToken=${accessToken}`
    );
  } catch (error) {
    console.log(error);
    res.redirect(`${process.env.CLIENT_BASE_URL!}/oauth/error`);
  }
};

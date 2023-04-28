import axios from "axios";
import qs from "qs";

import { User } from "../model/user.model";
import { UserModel } from "../model";

interface GoogleTokensResult {
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token: string;
}

export function registerUser(input: Partial<User>) {
  return UserModel.create(input);
}

export function loginUser(email: string) {
  return UserModel.findOne({ email: email }).exec();
}

export async function getGoogleOAuthTokens({
  code,
}: {
  code: string;
}): Promise<GoogleTokensResult> {
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
    grant_type: "authorization_code",
  };

  const res = await axios.post<GoogleTokensResult>(url, qs.stringify(values), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return res.data;
}

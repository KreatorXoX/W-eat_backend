import jwt from "jsonwebtoken";

export function signJwt(
  object: Object,
  keyName: "accessTokenSecret" | "refreshTokenSecret",
  options?: jwt.SignOptions | undefined
) {
  const signingKey =
    keyName === "accessTokenSecret"
      ? process.env.ACCESS_TOKEN_SECRET
      : process.env.REFRESH_TOKEN_SECRET;

  return jwt.sign(object, signingKey!, {
    ...(options && options),
  });
}

export function verifyJwt<T>(
  token: string,
  keyName: "accessTokenSecret" | "refreshTokenSecret"
): T | null {
  const verifyKey =
    keyName === "accessTokenSecret"
      ? process.env.ACCESS_TOKEN_SECRET
      : process.env.REFRESH_TOKEN_SECRET;

  try {
    const decoded = jwt.verify(token, verifyKey!) as T;
    return decoded;
  } catch (e) {
    return null;
  }
}

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET = process.env.JWT_SECRET ?? "dev-secret-change-in-production";

export type TokenPayload = {
  userId: string;
  email: string;
  role: string;
};

export const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, 12);

export const comparePassword = (plain: string, hash: string): Promise<boolean> =>
  bcrypt.compare(plain, hash);

export const signToken = (payload: TokenPayload): string =>
  jwt.sign(payload, SECRET, { expiresIn: "7d" });

export const verifyToken = (token: string): TokenPayload =>
  jwt.verify(token, SECRET) as TokenPayload;

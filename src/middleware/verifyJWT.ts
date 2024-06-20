import { Request, RequestHandler } from "express";
import { VerifyErrors, VerifyOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import env from "../utils/validateEnv";
interface VerifyJWTBody extends Request {
  userId: string;
  roles: string[];
  username: string;
}

interface DecodedBody extends VerifyOptions {
  UserInfo: {
    userId: string;
    roles: string[];
    username: string;
  };
}

export const verifyJWT: RequestHandler<
  unknown,
  unknown,
  VerifyJWTBody,
  unknown
> = (req, res, next) => {
  // ?? req.headers.Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(
    token,
    env.ACCESS_TOKEN_SECRET,
    // @ts-ignore
    (err: VerifyErrors, decoded: DecodedBody) => {
      if (err) return res.status(403).json({ message: `Forbidden ${err}` });
      next();
    }
  );
};

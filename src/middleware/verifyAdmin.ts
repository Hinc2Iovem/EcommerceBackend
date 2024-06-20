import jwt, { VerifyErrors, VerifyOptions } from "jsonwebtoken";
import env from "../utils/validateEnv";
import { RequestHandler } from "express";
import USER_ROLES from "../const/USER_ROLES";

interface DecodedBody extends VerifyOptions {
  UserInfo: {
    username: string;
    roles: string[];
    user: string;
  };
}

export const verifyAdmin: RequestHandler = (req, res, next) => {
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
      if (err) return res.status(403).json({ message: "Forbidden" });
      if (
        !decoded.UserInfo.roles.includes(USER_ROLES.ADMIN) ||
        !decoded.UserInfo.roles.includes("Admin")
      ) {
        return res
          .status(403)
          .json({ message: "You do not have enought rights for this" });
      }
      next();
    }
  );
};

import { RequestHandler } from "express";
import jwt, { VerifyErrors, VerifyOptions } from "jsonwebtoken";
import env from "../utils/validateEnv";
import createHttpError from "http-errors";
import { valueExists } from "../utils/valueExists";
import User from "../models/User";
import bcrypt from "bcrypt";

export interface SignUpBody {
  username?: string;
  password?: string;
  roles?: string[];
}

// @route POST http://localhost:3500/auth/register
// @access Public
export const signUp: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  const { password: passwordRaw, roles, username } = req.body;

  if (!username || !passwordRaw) {
    throw createHttpError(401, "Missing Credentials");
  }

  const duplicate = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    throw createHttpError(409, "Such username is already taken");
  }

  const password = await bcrypt.hash(passwordRaw, 10);

  const newUser = await User.create({ username, password, roles });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: newUser.username,
        roles: newUser.roles,
        userId: newUser._id,
      },
    },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    {
      username: newUser.username,
    },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
};

export interface LoginBody {
  username?: string;
  password?: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async (req, res) => {
  const { password: passwordRaw, username } = req.body;

  if (!username || !passwordRaw) {
    throw createHttpError(401, "Missing Credentials");
  }

  const foundUser = await User.findOne({ username }).select("+password").exec();
  valueExists({ value: foundUser, valueName: "User" });

  const comparedPassword = await bcrypt.compare(
    passwordRaw,
    foundUser!.password
  );
  if (!comparedPassword) {
    throw createHttpError(401, "Invalid Credentials");
  }

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser!.username,
        roles: foundUser!.roles,
        userId: foundUser!._id,
      },
    },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    {
      username: foundUser!.username,
    },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
};

interface DecodedBody extends VerifyOptions {
  username: string;
}

export const refresh: RequestHandler = async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const refreshToken = cookie.jwt;

  jwt.verify(
    refreshToken,
    env.REFRESH_TOKEN_SECRET,
    // @ts-ignore
    async (error: VerifyErrors | null, decoded: DecodedBody | undefined) => {
      if (error) return res.status(403).json({ message: error });
      const foundUser = await User.findOne({
        username: decoded?.username,
      }).exec();
      if (!foundUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
            userId: foundUser._id,
          },
        },
        env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      res.json({ accessToken });
    }
  );
};

export const logout: RequestHandler = async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) return res.sendStatus(204);
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.json({ message: "Logout successful" });
};

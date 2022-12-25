import { v2 } from "cloudinary";
import { NextFunction, Request, Response } from "express";
import { COOKIE_NAME, getMagic } from "./constants";
import { AuthRequest } from "./types";

export const isAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const astroqid = req.cookies[COOKIE_NAME];
    if (!astroqid) return res.json({ message: "Unauthorized Access!" });

    getMagic().token.validate(astroqid.didToken);

    const magicUser = await getMagic().users.getMetadataByToken(
      astroqid.didToken
    );
    if (!magicUser.issuer) return res.json({ message: "User doesn't exist!" });

    req.user = { magicID: magicUser.issuer, userID: astroqid.userID };
    next();
  } catch (error) {
    console.error(error);
    return res.json("Something has happened!");
  }
};

export const cloudinary = (_: Request, __: Response, next: NextFunction) => {
  v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  next();
};

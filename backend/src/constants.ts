import { Magic } from "@magic-sdk/admin";
export const getMagic = () => new Magic(process.env.MAGIC_SECRET_API_KEY);
export const COOKIE_NAME = "astroqid";

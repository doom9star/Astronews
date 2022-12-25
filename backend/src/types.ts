import { Request } from "express";

export type AuthRequest = Request & {
  user?: { magicID: string; userID: string };
};

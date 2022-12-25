import { Router } from "express";
import { COOKIE_NAME, getMagic } from "../constants";
import User from "../entities/User";
import { isAuth } from "../middleware";
import { AuthRequest } from "../types";

const router = Router();

router.get("/me", isAuth, async (req: AuthRequest, res) => {
  const user = await User.findOne({
    where: { id: req.user?.userID },
    relations: ["group", "group.logo", "avatar"],
  });
  return res.json(user);
});

router.post("/login", async (req, res) => {
  try {
    let didToken = req.body.didToken;
    const magicUser = await getMagic().users.getMetadataByToken(didToken);
    if (!magicUser.issuer || !magicUser.email) {
      return res.json({ message: "Something has happened!" });
    }
    let user = await User.findOne({
      where: { magicID: magicUser.issuer },
      relations: ["group", "group.logo", "avatar"],
    });
    if (!user) {
      user = new User();
      user.email = magicUser.email;
      user.name = magicUser.email.split("@")[0];
      user.magicID = magicUser.issuer;
      user.bio = "";
      await user.save();
    }
    res.cookie(COOKIE_NAME, { didToken, userID: user.id });
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.json({ message: "Something has happened!" });
  }
});

router.delete("/logout", isAuth, async (req: AuthRequest, res) => {
  res.clearCookie(COOKIE_NAME);
  await getMagic().users.logoutByIssuer(req.user?.magicID!);
  return res.json(null);
});

export default router;

import { v2 } from "cloudinary";
import { Router } from "express";
import { Not } from "typeorm";
import Media, { MediaState } from "../entities/Media";
import User from "../entities/User";
import { cloudinary, isAuth } from "../middleware";
import { AuthRequest } from "../types";

const router = Router();

router.put("/", cloudinary, isAuth, async (req: AuthRequest, res) => {
  const { name, bio, avatar, avatarState } = req.body;
  const userID = req.user?.userID!;
  const exists = await User.findOne({
    where: { name, id: Not(userID) },
  });
  if (exists) {
    return res.json({ message: "username already exists!" });
  }
  const user = await User.findOne({
    where: { id: userID },
    relations: ["avatar"],
  });
  if (!user) return res.json(null);
  user.name = name;
  user.bio = bio;
  if (avatarState === MediaState.UPDATE || avatarState === MediaState.REMOVE) {
    if (user.avatar) await v2.uploader.destroy(user.avatar.cid);
    if (avatarState === MediaState.UPDATE) {
      const result = await v2.uploader.upload(avatar);
      if (!user.avatar) user.avatar = new Media();
      user.avatar.url = result.secure_url;
      user.avatar.cid = result.public_id;
    } else if (avatarState === MediaState.REMOVE) {
      await user.avatar.remove();
    }
  }
  await user.save();

  return res.json({ avatar: user.avatar });
});

export default router;

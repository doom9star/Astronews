import { v2 } from "cloudinary";
import { Router } from "express";
import { Not } from "typeorm";
import Group, { EDesignation } from "../entities/Group";
import Media, { MediaState } from "../entities/Media";
import User from "../entities/User";
import { cloudinary, isAuth } from "../middleware";
import { AuthRequest } from "../types";

const router = Router();

router.post("/new", cloudinary, isAuth, async (req: AuthRequest, res) => {
  const user = await User.findOne({ where: { id: req.user?.userID } });
  if (!user) {
    return res.json({ message: "User doesn't exist!" });
  }
  const group = new Group();
  group.name = req.body.name;
  group.description = req.body.description;
  if (req.body.logo) {
    group.logo = new Media();
    const result = await v2.uploader.upload(req.body.logo);
    group.logo.url = result.secure_url;
    group.logo.cid = result.public_id;
  }
  group.members = [user];
  group.followers = [];
  group.designations = [{ mid: user.id, designation: EDesignation.LEADER }];
  await group.save();

  return res.json({ group });
});

router.get("/one/:groupID", isAuth, async (req: AuthRequest, res) => {
  const group = await Group.findOne({
    where: { id: <string>req.query.groupID },
    relations: ["members", "logo"],
  });
  return res.json({ group });
});

router.put("/", cloudinary, isAuth, async (req: AuthRequest, res) => {
  const { groupID, logoState, ...values } = req.body;
  const exists = await Group.findOne({
    where: { id: Not(groupID), name: values.name },
  });
  if (exists) {
    return res.json({ message: "Group already exists!" });
  }

  const group = await Group.findOne({
    where: { id: groupID },
    relations: ["logo"],
  });
  if (!group) return res.json(null);
  group.name = values.name;
  group.description = values.description;
  group.private = values.private;
  if (logoState === MediaState.UPDATE || logoState === MediaState.REMOVE) {
    if (group.logo) await v2.uploader.destroy(group.logo.cid);
    if (logoState === MediaState.UPDATE) {
      const result = await v2.uploader.upload(values.logo);
      if (!group.logo) group.logo = new Media();
      group.logo.url = result.secure_url;
      group.logo.cid = result.public_id;
    } else if (logoState === MediaState.REMOVE) {
      await group.logo.remove();
    }
  }
  await group.save();

  return res.json({ logo: group.logo });
});

router.put("/follow", isAuth, async (req: AuthRequest, res) => {
  const { follow, groupID } = req.body;
  const group = await Group.findOne({ where: { id: groupID } });
  if (!group) return res.json(null);
  if (follow === "F") {
    group.followers.push(req.user!.userID);
  } else {
    group.followers = group.followers.filter((f) => f !== req.user?.userID);
  }
  await group.save();
  return res.json(null);
});

export default router;

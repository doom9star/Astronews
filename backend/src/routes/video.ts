import { v2 } from "cloudinary";
import { Router } from "express";
import { Not } from "typeorm";
import Comment from "../entities/Comment";
import Media from "../entities/Media";
import User from "../entities/User";
import Video from "../entities/Video";
import { cloudinary, isAuth } from "../middleware";
import { AuthRequest } from "../types";

const router = Router();

router.post("/new", cloudinary, isAuth, async (req: AuthRequest, res) => {
  const { caption, description, video, groupID } = req.body;

  const eVideo = new Video();
  eVideo.caption = caption;
  eVideo.description = description;
  eVideo.group = <any>{ id: groupID };
  eVideo.upvotes = [];
  eVideo.downvotes = [];
  eVideo.views = [];
  try {
    const result = await v2.uploader.upload(video, { resource_type: "video" });
    eVideo.video = new Media();
    eVideo.video.url = result.secure_url;
    eVideo.video.cid = result.public_id;
  } catch (err) {
    console.log(err);
    throw new Error("Shit");
  }

  await eVideo.save();

  return res.json({ video: eVideo });
});

router.get(
  "/many/:location(home|group)/:groupID?",
  isAuth,
  async (req: AuthRequest, res) => {
    const { location, groupID } = req.params;
    let videos: Video[] = [];
    if (location === "home") {
      videos = await Video.find({
        where: { group: { private: false } },
        relations: ["video", "group"],
      });
    } else if (location === "group") {
      videos = await Video.find({
        where: { group: { id: groupID } },
        relations: ["video", "group"],
        order: { createdAt: "DESC" },
      });
    }
    return res.json(videos);
  }
);

router.get("/one/:videoID", isAuth, async (req: AuthRequest, res) => {
  const videoID = req.query.videoID as string;
  const video = await Video.findOne({
    where: { id: videoID },
    relations: [
      "video",
      "group",
      "comments",
      "comments.user",
      "comments.user.avatar",
    ],
  });
  if (!video) return res.json(null);

  if (!video.views.includes(req.user!.userID)) {
    video.views.push(req.user!.userID);
    await video.save();
  }

  const suggestions = await Video.find({
    where: { id: Not(videoID) },
    relations: ["video", "group"],
  });
  return res.json({ video, suggestions });
});

router.post("/comment", isAuth, async (req: AuthRequest, res) => {
  const { body, videoID } = req.body;

  const comment = new Comment();
  comment.body = body;
  comment.video = <any>{ id: videoID };
  comment.user = <any>await User.findOne({
    where: { id: req.user?.userID },
    relations: ["avatar"],
  });
  await comment.save();

  return res.json(comment);
});

router.post("/vote", isAuth, async (req: AuthRequest, res) => {
  const { videoID, vote } = req.body;
  const article = await Video.findOne({
    where: { id: videoID },
    relations: [
      "video",
      "group",
      "comments",
      "comments.user",
      "comments.user.avatar",
    ],
  });
  if (!article) return res.json(null);
  if (vote === "U") {
    article.downvotes = article.downvotes.filter(
      (uid) => uid !== req.user?.userID
    );
    article.upvotes.push(req.user!.userID);
  } else {
    article.upvotes = article.upvotes.filter((uid) => uid !== req.user?.userID);
    article.downvotes.push(req.user!.userID);
  }
  await article.save();
  return res.json(article);
});

export default router;

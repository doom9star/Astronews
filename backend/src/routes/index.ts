import { Router } from "express";
import AuthRouter from "./auth";
import GroupRouter from "./group";
import ProfileRouter from "./profile";
import ArticleRouter from "./article";
import VideoRouter from "./video";
import { isAuth } from "../middleware";
import { AuthRequest } from "../types";
import Article from "../entities/Article";
import { Like } from "typeorm";
import Group from "../entities/Group";
import Video from "../entities/Video";

const router = Router();
router.use("/auth", AuthRouter);
router.use("/group", GroupRouter);
router.use("/profile", ProfileRouter);
router.use("/article", ArticleRouter);
router.use("/video", VideoRouter);

router.get("/", (_, res) => {
  return res.send("Server works!");
});

router.get(
  "/search/:type(articles|groups|videos)/:query",
  isAuth,
  async (req: AuthRequest, res) => {
    const query = req.query.query as string;
    const type = req.query.type as string;
    if (type === "articles") {
      const articles = await Article.find({
        where: { title: Like(`%${query}%`), group: { private: false } },
        relations: ["group", "thumbnail"],
      });
      return res.json(articles);
    } else if (type === "groups") {
      const groups = await Group.find({
        where: { name: Like(`%${query}%`), private: false },
        relations: ["members", "logo"],
      });
      return res.json(groups);
    } else {
      const videos = await Video.find({
        where: { caption: Like(`%${query}%`), group: { private: false } },
        relations: ["video", "group"],
      });
      return res.json(videos);
    }
  }
);

export default router;

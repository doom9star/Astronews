import { v2 } from "cloudinary";
import { Router } from "express";
import { Like, Not } from "typeorm";
import Article from "../entities/Article";
import Comment from "../entities/Comment";
import Media from "../entities/Media";
import User from "../entities/User";
import { cloudinary, isAuth } from "../middleware";
import { AuthRequest } from "../types";

const router = Router();

router.post("/new", cloudinary, isAuth, async (req: AuthRequest, res) => {
  const { title, body, thumbnail, keywords, groupID } = req.body;

  const article = new Article();
  article.title = title;
  article.body = body;
  if (thumbnail) {
    article.thumbnail = new Media();
    const result = await v2.uploader.upload(thumbnail);
    article.thumbnail.url = result.secure_url;
    article.thumbnail.cid = result.public_id;
  }
  article.group = <any>{ id: groupID };
  article.upvotes = [];
  article.downvotes = [];
  article.keywords = keywords;
  await article.save();

  return res.json({ article });
});

router.get(
  "/many/:location(home|group)/:groupID?",
  isAuth,
  async (req: AuthRequest, res) => {
    const { location, groupID } = req.params;
    let articles: Article[] = [];
    if (location === "home") {
      articles = await Article.find({
        where: { group: { private: false } },
        relations: ["group", "thumbnail"],
      });
    } else if (location === "group") {
      articles = await Article.find({
        where: { group: { id: groupID } },
        relations: ["group", "thumbnail"],
        order: { createdAt: "DESC" },
      });
    }
    return res.json(articles);
  }
);

router.get("/one/:articleID", isAuth, async (req: AuthRequest, res) => {
  const articleID = req.query.articleID as string;
  const article = await Article.findOne({
    where: { id: articleID },
    relations: [
      "group",
      "thumbnail",
      "comments",
      "comments.user",
      "comments.user.avatar",
    ],
  });
  if (!article) return res.json(null);

  if (!article.views.includes(req.user!.userID)) {
    article.views.push(req.user!.userID);
    await article.save();
  }

  let suggestions: Article[] = [];
  for (const key of article.keywords) {
    suggestions = suggestions.concat(
      await Article.find({
        where: { id: Not(articleID), keywords: Like(`%${key}%`) },
        relations: ["group", "thumbnail"],
      })
    );
  }
  suggestions = [...new Map(suggestions.map((s) => [s["id"], s])).values()];
  return res.json({ article, suggestions });
});

router.post("/comment", isAuth, async (req: AuthRequest, res) => {
  const { body, articleID } = req.body;

  const comment = new Comment();
  comment.body = body;
  comment.article = <any>{ id: articleID };
  comment.user = <any>await User.findOne({
    where: { id: req.user?.userID },
    relations: ["avatar"],
  });
  await comment.save();

  return res.json(comment);
});

router.post("/vote", isAuth, async (req: AuthRequest, res) => {
  const { articleID, vote } = req.body;
  const article = await Article.findOne({
    where: { id: articleID },
    relations: ["group", "comments", "comments.user", "comments.user.avatar"],
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

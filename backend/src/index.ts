import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { DataSource } from "typeorm";
import BodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

import MainRouter from "./routes";
import User from "./entities/User";
import Group from "./entities/Group";
import Article from "./entities/Article";
import Comment from "./entities/Comment";
import Media from "./entities/Media";
import Video from "./entities/Video";

async function main() {
  dotenv.config({ path: path.join(__dirname, "../.env") });

  const TDS = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "astronews",
    entities: [User, Group, Article, Comment, Media, Video],
    synchronize: true,
    logging: false,
  });
  await TDS.initialize();

  const app = express();
  const port = process.env.PORT;

  app.use(cors({ origin: process.env.CLIENT, credentials: true }));
  app.use(cookieParser());
  app.use(BodyParser.json({ limit: "50mb" }));
  app.use("/", MainRouter);

  app.listen(port, () => {
    console.log(`Server started at port-[${port}]`);
  });
}

main();

import { Column, Entity, ManyToOne } from "typeorm";
import Article from "./Article";
import Base from "./Base";
import User from "./User";
import Video from "./Video";

@Entity("comments")
export default class Comment extends Base {
  @Column("text")
  body: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Article, { onDelete: "CASCADE" })
  article: Article;

  @ManyToOne(() => Video, { onDelete: "CASCADE" })
  video: Video;
}

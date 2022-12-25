import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import Base from "./Base";
import Comment from "./Comment";
import Group from "./Group";
import Media from "./Media";

@Entity("articles")
export default class Article extends Base {
  @Column()
  title: string;

  @Column("text")
  body: string;

  @Column("simple-array")
  upvotes: string[];

  @Column("simple-array")
  downvotes: string[];

  @Column("simple-array")
  views: string[];

  @Column("simple-array")
  keywords: string[];

  @ManyToOne(() => Group, { onDelete: "CASCADE" })
  group: Group;

  @OneToMany(() => Comment, (c) => c.article)
  comments: Comment[];

  @OneToOne(() => Media, { onDelete: "SET NULL", cascade: true })
  @JoinColumn()
  thumbnail: Media;
}

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

@Entity("videos")
export default class Video extends Base {
  @Column()
  caption: string;

  @Column("text")
  description: string;

  @OneToOne(() => Media, { onDelete: "SET NULL", cascade: true })
  @JoinColumn()
  video: Media;

  @ManyToOne(() => Group, { onDelete: "CASCADE" })
  group: Group;

  @Column("simple-array")
  views: string[];

  @Column("simple-array")
  upvotes: string[];

  @Column("simple-array")
  downvotes: string[];

  @OneToMany(() => Comment, (c) => c.video)
  comments: Comment[];
}

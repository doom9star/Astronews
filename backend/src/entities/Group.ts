import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import Article from "./Article";
import Base from "./Base";
import Media from "./Media";
import User from "./User";
import Video from "./Video";

export enum EDesignation {
  LEADER = "LEADER",
  COLEADER = "COLEADER",
  MEMBER = "MEMBER",
}

@Entity("groups")
export default class Group extends Base {
  @Column({ unique: true })
  name: string;

  @Column("text")
  description: string;

  @Column({ default: false })
  certified: boolean;

  @Column({ default: false })
  private: boolean;

  @Column("simple-json")
  designations: { mid: string; designation: EDesignation }[];

  @Column("simple-array")
  followers: string[];

  @OneToMany(() => User, (m) => m.group)
  members: User[];

  @OneToMany(() => Article, (a) => a.group)
  articles: Article[];

  @OneToMany(() => Video, (v) => v.group)
  videos: Video[];

  @OneToOne(() => Media, { onDelete: "SET NULL", cascade: true })
  @JoinColumn()
  logo: Media;
}

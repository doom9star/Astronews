import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import Base from "./Base";
import Group from "./Group";
import Media from "./Media";

@Entity("users")
export default class User extends Base {
  @Column()
  email: string;

  @Column()
  magicID: string;

  @Column({ unique: true })
  name: string;

  @Column("text")
  bio: string;

  @ManyToOne(() => Group, (g) => g.members)
  group: Group;

  @OneToOne(() => Media, { onDelete: "SET NULL", cascade: true })
  @JoinColumn()
  avatar: Media;
}

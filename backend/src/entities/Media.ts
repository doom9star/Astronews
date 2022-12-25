import { Column, Entity } from "typeorm";
import Base from "./Base";

export enum MediaState {
  NONE = "NONE",
  UPDATE = "UPDATE",
  REMOVE = "REMOVE",
}

@Entity("medias")
export default class Media extends Base {
  @Column()
  url: string;

  @Column()
  cid: string;
}

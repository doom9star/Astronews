interface ICommon {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser extends ICommon {
  name: string;
  bio: string;
  email: string;
  magicID: string;
  group: IGroup | null;
  avatar: IMedia;
}

export enum EDesignation {
  LEADER = "LEADER",
  COLEADER = "COLEADER",
  MEMBER = "MEMBER",
}

export interface IGroup extends ICommon {
  logo: IMedia;
  name: string;
  members: IUser[];
  private: boolean;
  followers: string[];
  description: string;
  designations: { mid: string; designation: EDesignation }[];
}

export interface IArticle extends ICommon {
  body: string;
  title: string;
  group: IGroup;
  views: string[];
  upvotes: string[];
  thumbnail: IMedia;
  keywords: string[];
  downvotes: string[];
  comments: IComment[];
}

export interface IVideo extends ICommon {
  caption: string;
  description: string;
  video: IMedia;
  group: IGroup;
  views: string[];
  downvotes: string[];
  upvotes: string[];
  comments: IComment[];
}

export interface IMedia extends ICommon {
  url: string;
  cid: IUser;
}

export enum EMediaState {
  NONE = "NONE",
  UPDATE = "UPDATE",
  REMOVE = "REMOVE",
}

export interface IComment extends ICommon {
  body: string;
  user: IUser;
}

import { Card, Typography } from "antd";
import Link from "next/link";
import React from "react";
import { IVideo } from "../other/types";
import { getH264CodecURL } from "../other/utils";
import {
  PlayCircleOutlined,
  UpSquareOutlined,
  DownSquareOutlined,
} from "@ant-design/icons";

type Props = {
  video: IVideo;
};

function VideoCard({ video }: Props) {
  return (
    <Link href={`/home/video/${video.id}`}>
      <a>
        <Card
          hoverable
          style={{ width: 250 }}
          cover={
            <div style={{ position: "relative" }}>
              <video style={{ height: 200, width: "100%" }}>
                <source
                  src={getH264CodecURL(video.video.url)}
                  type="video/mp4"
                />
              </video>
              <PlayCircleOutlined
                style={{
                  position: "absolute",
                  top: "40%",
                  left: "45%",
                  color: "white",
                  fontSize: "2rem",
                  textShadow: "4px 4px black",
                }}
              />
            </div>
          }
        >
          <Typography.Title level={5}>{video.caption}</Typography.Title>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography.Text>{video.group.name}</Typography.Text>
            <div>
              <Typography.Text style={{ marginRight: "1rem" }}>
                <UpSquareOutlined style={{ color: "green" }} />{" "}
                {video.upvotes.length}
              </Typography.Text>
              <Typography.Text>
                <DownSquareOutlined style={{ color: "red" }} />{" "}
                {video.downvotes.length}
              </Typography.Text>
            </div>
          </div>
        </Card>
      </a>
    </Link>
  );
}

export default VideoCard;

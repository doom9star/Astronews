import { Card, Typography } from "antd";
import Link from "next/link";
import { IArticle } from "../other/types";
import { UpSquareOutlined, DownSquareOutlined } from "@ant-design/icons";

type Props = {
  article: IArticle;
};

function Article({ article }: Props) {
  return (
    <Link href={`/home/article/${article.id}`}>
      <a>
        <Card
          hoverable
          style={{ width: 250 }}
          cover={
            <img
              src={
                article.thumbnail
                  ? article.thumbnail.url
                  : "/images/nothumbnail.png"
              }
              alt="Article-Image"
              height={200}
            />
          }
        >
          <Typography.Title level={5}>{article.title}</Typography.Title>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography.Text>{article.group.name}</Typography.Text>
            <div>
              <Typography.Text style={{ marginRight: "1rem" }}>
                <UpSquareOutlined style={{ color: "green" }} />{" "}
                {article.upvotes.length}
              </Typography.Text>
              <Typography.Text>
                <DownSquareOutlined style={{ color: "red" }} />{" "}
                {article.downvotes.length}
              </Typography.Text>
            </div>
          </div>
        </Card>
      </a>
    </Link>
  );
}

export default Article;

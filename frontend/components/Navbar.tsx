import { Menu, Button, Typography } from "antd";
import React from "react";
import {
  MailOutlined,
  VideoCameraOutlined,
  UsergroupAddOutlined,
  GroupOutlined,
  PlusOutlined,
  SettingOutlined,
  SearchOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useCtx } from "../other/context";
import { useRouter } from "next/router";
import Image from "next/image";

function Navbar() {
  const { user } = useCtx();
  const router = useRouter();
  const tab = router.asPath.split("/").slice(-1)[0];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem",
      }}
    >
      <Menu
        mode="horizontal"
        defaultSelectedKeys={[tab]}
        style={{ width: "70%" }}
      >
        <Menu.Item key="articles" icon={<MailOutlined />}>
          <Link href={"/home/articles"}>
            <a>Articles</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="videos" icon={<VideoCameraOutlined />}>
          <Link href={"/home/videos"}>
            <a>Videos</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="search" icon={<SearchOutlined />}>
          <Link href={"/home/search"}>
            <a>Search</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="profile" icon={<UserOutlined />}>
          <Link href={"/home/profile"}>
            <a>Profile</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="notifications" icon={<BellOutlined />}>
          <Link href={"/home/notifications"}>
            <a>Notifications</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="settings" icon={<SettingOutlined />}>
          <Link href={"/home/settings"}>
            <a>Settings</a>
          </Link>
        </Menu.Item>
      </Menu>
      <div>
        {!user?.group ? (
          <Link href={"/home/group/create"}>
            <a>
              <Button type="primary">
                <PlusOutlined /> Group
              </Button>
            </a>
          </Link>
        ) : (
          <Link href={`/home/group/${user.group.id}`}>
            <a style={{ display: "flex", alignItems: "center" }}>
              <Image
                src={
                  user.group.logo
                    ? user.group.logo.url
                    : "/images/nothumbnail.png"
                }
                alt="Group-Logo"
                width={50}
                height={50}
                style={{ borderRadius: "100%" }}
              />
              <Typography.Text
                style={{
                  marginLeft: "0.7rem",
                  fontWeight: "bold",
                  fontSize: "0.7rem",
                  fontFamily: "cursive",
                }}
                className="underlineOnHover"
              >
                {user.group.name}
              </Typography.Text>
            </a>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;

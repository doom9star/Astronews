import { LeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/router";

function Back() {
  const router = useRouter();
  return (
    <Button type="ghost" onClick={() => router.back()}>
      <LeftOutlined />
    </Button>
  );
}

export default Back;

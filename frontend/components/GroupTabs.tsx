import { Button, Card, Input, Radio, Spin } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  useState,
  useEffect,
  SetStateAction,
  Dispatch,
  useCallback,
  useRef,
} from "react";
import { cAxios } from "../other/constants";
import { EMediaState, IArticle, IGroup, IVideo } from "../other/types";
import ArticleCard from "./ArticleCard";
import {
  PlusOutlined,
  SaveOutlined,
  EditOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import TextArea from "antd/lib/input/TextArea";
import { useCtx } from "../other/context";
import VideoCard from "./VideoCard";

type Props = {
  currentTab: string;
  group: IGroup | null;
  setGroup: Dispatch<SetStateAction<IGroup | null>>;
};

const GroupTabs = ({ currentTab, group, setGroup }: Props) => {
  return (
    <div style={{ padding: "2rem 0rem" }}>
      {currentTab === "articles" ? (
        <Articles />
      ) : currentTab === "videos" ? (
        <Videos />
      ) : currentTab === "debates" ? (
        <Debates />
      ) : (
        <Edit group={group} setGroup={setGroup} />
      )}
    </div>
  );
};

const Articles = () => {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const groupID = router.query.groupID;

  useEffect(() => {
    setLoading(true);
    cAxios.get(`/article/many/group/${groupID}`).then(({ data }) => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <Link href={router.asPath + "/article/create"}>
        <p style={{ textAlign: "right" }}>
          <Button type="primary">
            <PlusOutlined /> Article
          </Button>
        </p>
      </Link>
      {loading ? (
        <Spin
          size="small"
          style={{ position: "absolute", top: "10%", left: "50%" }}
        />
      ) : (
        <div
          style={{
            margin: "2rem 1rem",
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(250px, 1fr))",
            gridGap: "2rem",
            justifyContent: "center",
          }}
        >
          {articles.map((a) => (
            <ArticleCard article={a} key={a.id} />
          ))}
        </div>
      )}
    </div>
  );
};

const Videos = () => {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const groupID = router.query.groupID;

  useEffect(() => {
    setLoading(true);
    cAxios.get(`/video/many/group/${groupID}`).then(({ data }) => {
      setVideos(data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <Link href={router.asPath + "/video/create"}>
        <p style={{ textAlign: "right" }}>
          <Button type="primary">
            <PlusOutlined /> Video
          </Button>
        </p>
      </Link>
      {loading ? (
        <Spin
          size="small"
          style={{ position: "absolute", top: "10%", left: "50%" }}
        />
      ) : (
        <div
          style={{
            margin: "2rem 1rem",
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(250px, 1fr))",
            gridGap: "2rem",
            justifyContent: "center",
          }}
        >
          {videos.map((v) => (
            <VideoCard video={v} key={v.id} />
          ))}
        </div>
      )}
    </div>
  );
};

const Debates = () => {
  return <div>Debates</div>;
};

type EditProps = Pick<Props, "group" | "setGroup">;
type TInfo = {
  name: string;
  description: string;
  private: boolean;
  logo: string;
};

const Edit = ({ group, setGroup }: EditProps) => {
  const [info, setInfo] = useState<TInfo>({
    name: group?.name || "",
    description: group?.description || "",
    private: !!group?.private,
    logo: group?.logo?.url || "",
  });
  const [nameError, setNameError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logoState, setLogoState] = useState(EMediaState.NONE);

  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const { setAlert, setUser } = useCtx();

  const onSave = useCallback(() => {
    setLoading(true);
    cAxios
      .put("/group", { ...info, logoState, groupID: group?.id })
      .then(({ data }) => {
        if (data.logo) {
          setGroup({ ...group!, ...(info as any), logo: data.logo });
          setUser((prev) => ({
            ...prev!,
            group: { ...prev?.group, ...(info as any), logo: data.logo },
          }));
          setInfo({ ...info, logo: data.logo.url });
          setAlert(`${"Group saved successfully!"}$${"success"}`);
        }
        setNameError(!!data?.message);
        setLoading(false);
      });
  }, [info, group, logoState]);

  const onLogoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setInfo((prev) => ({ ...prev, logo: e.target?.result as string }));
      setLogoState(EMediaState.UPDATE);
    };
    reader.readAsDataURL(e.target.files![0]);
  }, []);

  return (
    <Card
      style={{
        width: 400,
        backgroundColor: "rgb(245, 245, 245)",
        transform: "translateX(70%)",
      }}
      bodyStyle={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div>
        <EditOutlined
          style={{ cursor: "pointer" }}
          onClick={() => logoInputRef.current?.click()}
        />
        <input
          type={"file"}
          hidden
          ref={logoInputRef}
          accept="image/*"
          onChange={onLogoChange}
          onClick={(e) => (e.currentTarget.value = "")}
        />
        <Image
          src={info.logo ? info.logo : "/images/nothumbnail.png"}
          alt="Logo"
          width={70}
          height={70}
          style={{ borderRadius: "100%" }}
        />
        {info.logo && (
          <CloseOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setInfo({ ...info, logo: "" });
              setLogoState(EMediaState.REMOVE);
            }}
          />
        )}
      </div>
      <Input
        placeholder="Name"
        style={{ margin: "1rem 0rem" }}
        value={info.name}
        onChange={(e) => setInfo({ ...info, name: e.target.value })}
        status={nameError ? "error" : ""}
      />
      <TextArea
        rows={5}
        placeholder="Something about your group..."
        value={info.description}
        onChange={(e) => setInfo({ ...info, description: e.target.value })}
      />
      <Radio.Group
        value={info.private}
        style={{ margin: "2rem" }}
        onChange={(e) => setInfo({ ...info, private: e.target.value })}
      >
        <Radio value={false}>Public</Radio>
        <Radio value={true}>Private</Radio>
      </Radio.Group>
      {(group?.name !== info.name.trim() ||
        group.description !== info.description.trim() ||
        group.private !== info.private ||
        (group.logo?.url || "") !== info.logo) && (
        <Button
          type="primary"
          icon={<SaveOutlined />}
          style={{ marginTop: "1rem" }}
          onClick={onSave}
          loading={loading}
        >
          Save
        </Button>
      )}
    </Card>
  );
};

export default GroupTabs;

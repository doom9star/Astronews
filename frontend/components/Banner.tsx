import Image from "next/image";
import { useRouter } from "next/router";
import { useCtx } from "../other/context";

function Banner() {
  const { user } = useCtx();
  const router = useRouter();
  if (!user || router.asPath === "/") {
    return null;
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          color: "rgb(100, 100, 100)",
        }}
      >
        <Image
          src={user.avatar ? user.avatar.url : "/images/nouser.jpg"}
          alt="Profile-Image"
          width={60}
          height={60}
          layout={"fixed"}
          style={{ borderRadius: "100%" }}
        />
        <span style={{ marginLeft: "1rem", fontSize: "1.5rem" }}>
          Welcome Home,{" "}
          <span style={{ fontWeight: "bolder" }}>{user?.name}</span>
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          fontFamily: "cursive",
        }}
      >
        <span>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Reprehenderit, magnam!
        </span>
        <span style={{ fontWeight: "bold" }}>~lorem</span>
      </div>
    </div>
  );
}

export default Banner;

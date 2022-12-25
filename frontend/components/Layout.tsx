import { Alert, Spin } from "antd";
import Head from "next/head";
import React, { Fragment, FunctionComponent, ReactNode } from "react";
import { useEffect } from "react";
import { cAxios } from "../other/constants";
import { useCtx } from "../other/context";
import magic from "../other/magic";
import Banner from "./Banner";

export const Layout: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const { setLoading, setUser, loading, alert, setAlert } = useCtx();
  useEffect(() => {
    (async () => {
      setLoading(true);
      // await magic?.user.logout();
      const isLoggedIn = await magic?.user.isLoggedIn();
      if (isLoggedIn) {
        const mUser = await magic?.user.getMetadata();
        if (mUser) {
          const res = await cAxios.get("/auth/me");
          setUser(res.data);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Fragment>
      <Head>
        <title>Astronews</title>
      </Head>
      {loading ? (
        <Spin
          size="large"
          style={{ position: "absolute", top: "50%", left: "50%" }}
        />
      ) : (
        <>
          {alert && (
            <Alert
              message={alert.split("$")[0]}
              type={alert.split("$")[1] as any}
              showIcon
              closable
              onClose={() => setAlert("")}
            />
          )}
          <Banner />
          {children}
        </>
      )}
    </Fragment>
  );
};

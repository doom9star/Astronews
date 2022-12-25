import { useRouter } from "next/router";
import { useCtx } from "../other/context";

export function useIsAuth() {
  const { user } = useCtx();
  const router = useRouter();

  if (!user) {
    router.replace("/auth/login");
    return null;
  }
}

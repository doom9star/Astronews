import { Magic } from "magic-sdk";
import { MAGIC_PUBLISHABLE_KEY } from "./constants";

const magic =
  typeof window !== "undefined" ? new Magic(MAGIC_PUBLISHABLE_KEY) : null;
export default magic;

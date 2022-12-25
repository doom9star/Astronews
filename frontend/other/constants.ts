import axios from "axios";

export const MAGIC_PUBLISHABLE_KEY = process.env
  .NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY as string;

export const cAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER as string,
  withCredentials: true,
});

export const _24HR = 60 * 60 * 24;

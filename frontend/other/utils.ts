export const extractDate = (sdate?: string) => {
  if (!sdate) return "";
  const date = new Date(sdate);
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
};

export const getReadTime = (content?: string) => {
  if (!content) return "0 min";
  const wc = content.split(" ").length;
  if (wc > 60 * 60) {
    return `${(wc / 60 / 60).toFixed()} hr`;
  }
  return `${(wc / 60).toFixed()} min`;
};

export const getH264CodecURL = (url?: string) => {
  if (!url) return "";
  const s = url.split("upload");
  s.splice(1, 0, "upload/vc_h264");
  return s.join("");
};

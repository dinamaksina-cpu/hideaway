import HomeClient from "./home-client";
import { readdir } from "node:fs/promises";
import path from "node:path";

export default async function Home() {
  let photoFiles: string[] = [];
  try {
    const entries = await readdir(path.join(process.cwd(), "public", "photos"), { withFileTypes: true });
    photoFiles = entries.filter((item) => item.isFile() && /\.(jpe?g|png|webp|gif|avif)$/i.test(item.name))
      .map((item) => `/photos/${encodeURIComponent(item.name)}`)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  } catch (error) { console.warn("Unable to scan public/photos", error); }
  return <HomeClient photoFiles={photoFiles} />;
}

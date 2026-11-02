import HomeClient from "./home-client";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

export default async function Home() {
  let photoFiles: string[] = [];
  try {
    const entries = await readdir(path.join(process.cwd(), "public", "photos"), { withFileTypes: true });
    const names = entries.filter((item) => item.isFile() && /\.(jpe?g|png|webp|gif|avif)$/i.test(item.name))
      .map((item) => item.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    // The original template shipped with 26 stock-named property photos.
    // When the owner adds their own collection, do not append those 26 a second time.
    const legacy = new Set([
      "living-wide.webp", "exterior.webp", "terrace-wide.webp", "kitchen-wide.webp",
      "bedroom-ground.webp", "bedroom-loft.webp", "living-portrait.webp", "living-sofas.webp",
      "entrance.webp", "sun-terrace.webp", "garden-view.webp", "kitchen-corner.webp",
      "kitchen-full.webp", "kitchen-sink.webp", "kitchen-view.webp", "kitchen-window.webp",
      "bedside.webp", "wardrobe.webp", "loft-desk.webp", "loft-room.webp",
      "loft-single.webp", "loft-workspace.webp", "bathroom.webp", "shower.webp",
      "laundry.webp", "dining.webp",
    ]);
    const uploadedNames = names.filter((name) => !legacy.has(name.toLowerCase()));
    const galleryNames = uploadedNames.length ? uploadedNames : names;
    const seen = new Set<string>();
    for (const name of galleryNames) {
      const data = await readFile(path.join(process.cwd(), "public", "photos", name));
      const hash = createHash("sha256").update(data).digest("hex");
      if (seen.has(hash)) continue; // eliminate byte-identical duplicates
      seen.add(hash);
      photoFiles.push(`/photos/${encodeURIComponent(name)}`);
    }
  } catch (error) { console.warn("Unable to scan public/photos", error); }
  return <HomeClient photoFiles={photoFiles} />;
}

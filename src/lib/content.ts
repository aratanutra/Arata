import { promises as fs } from "fs";
import path from "path";
import type { SiteContent } from "@/types/content";

const CONTENT_PATH = path.join(process.cwd(), "content", "site-content.json");

export async function readContent(): Promise<SiteContent> {
  const raw = await fs.readFile(CONTENT_PATH, "utf8");
  return JSON.parse(raw) as SiteContent;
}

export async function writeContent(next: SiteContent): Promise<void> {
  const serialised = JSON.stringify(next, null, 2);
  await fs.writeFile(CONTENT_PATH, serialised, "utf8");
}

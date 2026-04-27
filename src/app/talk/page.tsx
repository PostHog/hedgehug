import fs from "fs"
import path from "path"
import { SlideViewer } from "@/components/talk/slide-viewer"

export const metadata = {
  title: "Talk | HedgeHug",
}

export default function TalkPage() {
  const talkDir = path.join(process.cwd(), "talk")
  const files = fs
    .readdirSync(talkDir)
    .filter((f) => f.endsWith(".md"))
    .sort()

  const slides = files.map((file) => ({
    filename: file,
    content: fs.readFileSync(path.join(talkDir, file), "utf-8"),
  }))

  return <SlideViewer slides={slides} />
}

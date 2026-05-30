export type ResourceProvider =
  | "youtube"
  | "vimeo"
  | "pdf"
  | "image"
  | "audio"
  | "article"
  | "unknown";

const youtubeHostnames = ["youtube.com", "www.youtube.com", "youtu.be", "m.youtube.com"];
const vimeoHostnames = ["vimeo.com", "www.vimeo.com", "player.vimeo.com"];
const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
const audioExtensions = [".mp3", ".wav", ".m4a", ".aac", ".ogg", ".flac"];

function hasExtension(pathname: string, extensions: string[]): boolean {
  const lowerPath = pathname.toLowerCase();
  return extensions.some((extension) => lowerPath.endsWith(extension));
}

export function detectProvider(url: string): ResourceProvider {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    const pathname = parsedUrl.pathname.toLowerCase();

    if (youtubeHostnames.some((allowed) => hostname === allowed)) {
      return "youtube";
    }

    if (vimeoHostnames.some((allowed) => hostname === allowed)) {
      return "vimeo";
    }

    if (hasExtension(pathname, [".pdf"])) {
      return "pdf";
    }

    if (hasExtension(pathname, imageExtensions)) {
      return "image";
    }

    if (hasExtension(pathname, audioExtensions)) {
      return "audio";
    }

    if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
      return "article";
    }

    return "unknown";
  } catch {
    return "unknown";
  }
}

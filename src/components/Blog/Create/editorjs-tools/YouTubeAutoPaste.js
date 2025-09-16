export default class YouTubeAutoPaste {
  static get isReadOnlySupported() {
    return true;
  }

  static get pasteConfig() {
    return {
      patterns: {
        youtube: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/[^\s]+$/i,
      },
    };
  }

  constructor({ api }) {
    this.api = api;
  }

  onPaste(event) {
    const pasted = event.detail && event.detail.data ? event.detail.data : "";
    const urlStr = typeof pasted === "string" ? pasted.trim() : "";
    if (!urlStr) return;

    const yt = toYouTubeEmbed(urlStr);
    if (!yt) return;

    const index = typeof event.detail?.index === "number" ? event.detail.index : undefined;

    this.api.blocks.insert(
      "embed",
      {
        service: "youtube",
        source: urlStr,
        embed: yt.embedUrl,
        width: 580,
        height: 320,
        caption: "",
      },
      {},
      typeof index === "number" ? index + 1 : undefined,
      true
    );
  }
}

function toYouTubeEmbed(input) {
  let url;
  try {
    url = new URL(input);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  const isYouTube =
    host === "youtu.be" ||
    host.endsWith("youtube.com") ||
    host === "m.youtube.com" ||
    host === "www.youtube.com";
  if (!isYouTube) return null;

  let videoId = "";
  const pathname = url.pathname;
  const parts = pathname.split("/").filter(Boolean);

  if (host === "youtu.be") {
    videoId = parts[0] === "shorts" ? (parts[1] || "") : (parts[0] || "");
  } else {
    if (pathname.startsWith("/watch")) {
      videoId = url.searchParams.get("v") || "";
    } else if (parts[0] === "shorts" && parts[1]) {
      videoId = parts[1];
    } else if (parts[0] === "embed" && parts[1]) {
      videoId = parts[1];
    }
  }
  if (!videoId) return null;

  const timeParam =
    url.searchParams.get("t") ||
    url.searchParams.get("start") ||
    (url.hash && url.hash.startsWith("#t=") ? url.hash.slice(3) : null);
  const startSeconds = timeParam ? parseTimeToSeconds(timeParam) : 0;

  const params = new URLSearchParams();
  params.set("rel", "0");
  params.set("modestbranding", "1");
  params.set("playsinline", "1");
  if (startSeconds > 0) params.set("start", String(startSeconds));

  const base = "https://www.youtube.com/embed/";
  return { embedUrl: `${base}${encodeURIComponent(videoId)}?${params.toString()}`, videoId, startSeconds };
}

function parseTimeToSeconds(raw) {
  if (!raw) return 0;
  if (/^\d+$/.test(raw)) return parseInt(raw, 10);
  const m = raw.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/i);
  if (!m) return 0;
  const h = parseInt(m[1] || "0", 10);
  const min = parseInt(m[2] || "0", 10);
  const s = parseInt(m[3] || "0", 10);
  return h * 3600 + min * 60 + s;
}
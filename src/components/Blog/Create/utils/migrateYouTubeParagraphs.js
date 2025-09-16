export function migrateYouTubeParagraphs(data) {
  if (!data || !Array.isArray(data.blocks)) return data;

  const blocks = data.blocks.map((b) => {
    if (!b || b.type !== "paragraph") return b;

    const text = String(b.data && b.data.text ? b.data.text : "").trim();
    if (!text) return b;

    const plain = stripTags(text).trim();

    if (isSingleUrl(plain) && isYouTubeUrl(plain)) {
      const yt = toYouTubeEmbed(plain);
      if (!yt) return b;
      return {
        type: "embed",
        data: {
          service: "youtube",
          source: plain,
          embed: yt.embedUrl,
          width: 580,
          height: 320,
          caption: "",
        },
      };
    }

    return b;
  });

  return { ...data, blocks };
}

function stripTags(html) {
  const hasDOM = typeof document !== "undefined" && document.createElement;
  if (hasDOM) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
  return html.replace(/<[^>]*>/g, "");
}

function isSingleUrl(text) {
  return /^https?:\/\/\S+$/.test(text);
}

function isYouTubeUrl(u) {
  try {
    const url = new URL(u);
    const h = url.hostname.toLowerCase();
    return h === "youtu.be" || h.endsWith("youtube.com") || h === "m.youtube.com" || h === "www.youtube.com";
  } catch {
    return false;
  }
}

function toYouTubeEmbed(input) {
  try {
    const url = new URL(input);
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
  } catch {
    return null;
  }
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
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { MediaPlayer, MediaProvider, YouTubeProvider } from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";

import { ComponentProps, useEffect, useRef, useState } from "react";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

type TVideoNodeViewProps = NodeViewProps;

export function YoutubeVideoComponent({ node }: TVideoNodeViewProps) {
  const src = node.attrs.src as string | undefined;
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const nudgeLayout = () => {
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event("resize"));
        setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
      });
    };

    nudgeLayout();

    return () => {};
  }, []);

  useEffect(() => {
    if (!mounted) return;
    requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    const t = setTimeout(() => window.dispatchEvent(new Event("resize")), 60);
    return () => clearTimeout(t);
  }, [src, mounted]);

  return (
    <NodeViewWrapper
      as="div"
      className="youtube-video-node my-4"
      ref={wrapperRef}
      style={{ minHeight: 180, display: "block" }}
    >
      {!mounted || !src ? (
        <div
          aria-hidden
          className="youtube-video-placeholder rounded bg-slate-50 dark:bg-slate-900"
          style={{ minHeight: 180 }}
        />
      ) : (
        <div key={src} className="youtube-player-wrapper w-full">
          <YouTubeVideoPlayer src={src} />
        </div>
      )}
    </NodeViewWrapper>
  );
}

export function YouTubeVideoPlayer(
  props: Omit<ComponentProps<typeof MediaPlayer>, "children">,
) {
  return (
    <MediaPlayer {...props} preload="metadata">
      <MediaProvider />
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
}

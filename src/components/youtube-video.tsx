import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { YoutubeVideoComponent } from "./youtube-video-comopnent";

export const YoutubeVideo = Node.create({
  name: "youtubeVideo",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "youtube-video",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["youtube-video", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(YoutubeVideoComponent);
  },
});

import React, {
  ReactNode,
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { YouTubeVideoPlayer } from "./youtube-video-comopnent";

type RenderTextEditorContentProps = {
  html: string;
};

function makeServerFallbackHtml(rawHtml: string) {
  return rawHtml.replace(
    /<youtube-video\b[^>]*\ssrc=(["'])(.*?)\1[^>]*>(?:<\/youtube-video>)?/gi,
    (_m, _q, src) =>
      `<div class="youtube-placeholder" data-youtube-src="${src}"><a href="${src}" target="_blank" rel="noopener noreferrer">${src}</a></div>`,
  );
}

/**
 * Build props map from Element attributes (strings only)
 */
function buildPropsFromElement(el: Element): Record<string, string> {
  const props: Record<string, string> = {};
  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes[i];
    props[attr.name] = attr.value;
  }
  return props;
}

/**
 * RenderTextEditorContent
 *
 * Key idea: convertNode(node, path) where path is a deterministic string
 * representing the index path in the tree, e.g. "0-2-1".
 */
export function RenderTextEditorContent({
  html,
}: RenderTextEditorContentProps) {
  const serverFallbackHtml = useMemo(
    () => makeServerFallbackHtml(html),
    [html],
  );

  const [isClient, setIsClient] = useState(false);
  const [nodes, setNodes] = useState<ReactNode | null>(null);

  const convertNode = useCallback((node: Node, path: string): ReactNode => {
    // TEXT NODE -> return string
    if (node.nodeType === Node.TEXT_NODE) {
      return (node as Text).nodeValue;
    }

    // ELEMENT NODE -> return React element
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const tagName = el.tagName.toLowerCase();

      // Special: youtube-video -> player; key uses src when possible
      if (tagName === "youtube-video") {
        const src = el.getAttribute("src") ?? "";
        const key = src || `youtube-${path}`;
        return <YouTubeVideoPlayer key={key} src={src} className="w-full" />;
      }

      // Convert children, passing down deterministic path
      const children: React.ReactNode[] = Array.from(el.childNodes).map(
        (child, i) => convertNode(child, `${path}-${i}`),
      );

      // Build element props (attributes)
      const props = buildPropsFromElement(el);

      // Ensure React sees a stable key for this element when used in arrays
      // We set it on props only if one doesn't already exist.
      // Note: DOM attributes don't include "key", so this is safe.
      (props as any).key = props.key ?? `el-${path}`;

      // Create element with children (no wrapper)
      return createElement(
        tagName,
        props,
        children.length ? children : undefined,
      );
    }

    // Others (comments, etc.) -> null
    return null;
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const converted = Array.from(doc.body.childNodes).map((child, i) =>
      convertNode(child, `${i}`),
    );

    setNodes(converted.length === 1 ? converted[0] : converted);
  }, [html, isClient, convertNode]);

  // No server fallback wrapper — render sanitized HTML if necessary
  if (!isClient) {
    // If you want to render something during SSR, add it here.
    // For now we keep it minimal like you requested.
    return (
      <div
        // NOTE: sanitize serverFallbackHtml before use in production!
        dangerouslySetInnerHTML={{ __html: serverFallbackHtml }}
      />
    );
  }

  return <div>{nodes}</div>;
}

"use client";

import { useMemo, useState } from "react";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";

const HTML_TAG = /<\/?[a-z][a-z0-9]*(\s[^>]*)?\/?>/i;

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    "a", "b", "i", "em", "strong", "u", "s", "br", "hr", "p", "div", "span",
    "ul", "ol", "li", "blockquote", "code", "pre",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "table", "thead", "tbody", "tr", "th", "td", "font",
  ],
  ALLOWED_ATTR: ["href", "title", "style", "color"],
  ALLOW_DATA_ATTR: false,
};

const STYLE_PROPS = new Set(["color", "background-color"]);

// Hex, rgb()/hsl() with plain numbers, or a bare keyword. No url(), var(), etc.
const SAFE_COLOR =
  /^(#[0-9a-f]{3,8}|(rgb|hsl)a?\([\d\s.,%/]+\)|[a-z]+)$/i;

/** Keep only color declarations from an untrusted style attribute. */
function filterStyle(style: string): string[] {
  return style
    .split(";")
    .map((decl) => {
      const i = decl.indexOf(":");
      if (i < 0) return "";
      const prop = decl.slice(0, i).trim().toLowerCase();
      const value = decl.slice(i + 1).trim();
      return STYLE_PROPS.has(prop) && SAFE_COLOR.test(value)
        ? `${prop}:${value}`
        : "";
    })
    .filter(Boolean);
}

// Runs once per sanitized element: harden links, and reduce `style` /
// `<font color>` to safe color declarations only.
if (typeof window !== "undefined") {
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A") {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer nofollow");
    }

    const decls = filterStyle(node.getAttribute("style") ?? "");
    const fontColor = node.getAttribute("color");
    if (fontColor && SAFE_COLOR.test(fontColor.trim())) {
      decls.push(`color:${fontColor.trim()}`);
    }
    node.removeAttribute("color");
    node.removeAttribute("style");
    if (decls.length > 0) node.setAttribute("style", decls.join(";"));
  });
}

export function MessageBody({ text }: { text: string }) {
  const [showSource, setShowSource] = useState(false);
  const isHtml = HTML_TAG.test(text);
  const html = useMemo(
    () => (isHtml ? DOMPurify.sanitize(text, SANITIZE_CONFIG) : ""),
    [isHtml, text]
  );

  if (!isHtml || showSource) {
    return (
      <div className="border-t pt-4">
        {isHtml && <ToggleButton showSource onClick={() => setShowSource(false)} />}
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
      </div>
    );
  }

  return (
    <div className="border-t pt-4">
      <ToggleButton showSource={false} onClick={() => setShowSource(true)} />
      <div
        data-testid="message-html"
        className="space-y-2 break-words text-sm leading-relaxed [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:font-semibold [&_hr]:border-border [&_ol]:list-decimal [&_ol]:pl-5 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-muted [&_pre]:p-2 [&_td]:border [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

function ToggleButton({
  showSource,
  onClick,
}: {
  showSource: boolean;
  onClick: () => void;
}) {
  return (
    <div className="mb-2 flex justify-end">
      <Button
        variant="ghost"
        size="xs"
        className="text-muted-foreground"
        onClick={onClick}
      >
        {showSource ? "View rendered" : "View source"}
      </Button>
    </div>
  );
}

"use client";

import { useZoom } from "@/hooks/use-zoom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import DOMPurify from "dompurify";
import { MagnificationController } from "./magnification-controller";

export function ArticleViewer({ content }: { content: string }) {
  const safeHTMLContent = DOMPurify.sanitize(content || "", {
    USE_PROFILES: { html: true },
    ALLOWED_ATTR: [
      "class",
      "style",
      "src",
      "alt",
      "title",
      "href",
      "target",
      "rel",
      "data-src",
      "data-href",
      "data-title",
      "data-alt",
      "data-target",
      "status",
      "data-status",
      "previewListener",
      "data-previewListener",
      "data-embed",
      "data-embed-type",
      "data-embed-id",
      "data-embed-url",
      "data-embed-provider",
      "data-embed-thumbnail",
      "data-embed-title",
      "data-bg",
      "data-ll-status",
    ],
  });

  const editor = useEditor({
    content: safeHTMLContent,
    editable: false, // Make it non-editable initially
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class: "prose dark:prose-dark",
      },
    },
  });

  const { zoom, zoomIn, zoomOut } = useZoom();

  return (
    <div className="prose dark:prose-dark">
      <EditorContent
        editor={editor}
        style={{ zoom: zoom, transition: "zoom 0.2s" }}
      />
      <MagnificationController zoom={zoom} zoomIn={zoomIn} zoomOut={zoomOut} />
    </div>
  );
}

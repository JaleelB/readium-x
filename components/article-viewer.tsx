"use client";

import { useZoom } from "@/hooks/use-zoom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import DOMPurify from "dompurify";
import { MagnificationController } from "./magnification-controller";
import {
  CustomHeading,
  CustomBlockquote,
  CustomCodeBlock,
  CustomImage,
  CustomFigcaption,
  CustomFigure,
  CustomParagraph,
  CustomEmphasis,
  CustomStrong,
  CustomLink,
  CustomDiv,
  CustomUL,
  CustomLI,
  CustomOL,
} from "@/lib/tiptap-extensions";

export function ArticleViewer({ content }: { content: string }) {
  const editor = useEditor({
    content: content,
    editable: false, // Make it non-editable initially
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        listItem: false,
        paragraph: false,
      }),
      CustomHeading(1),
      CustomHeading(2),
      CustomHeading(3),
      CustomHeading(4),
      CustomHeading(5),
      CustomHeading(6),
      CustomBlockquote,
      CustomCodeBlock,
      CustomImage,
      CustomFigcaption,
      CustomFigure,
      CustomParagraph,
      CustomEmphasis,
      CustomStrong,
      CustomLink,
      CustomDiv,
      CustomUL,
      CustomOL,
      CustomLI,
      // RawHTML,
    ],
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

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
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
import { useEffect } from "react";
import { useZoom } from "@/hooks/use-zoom";

function literalTemplate(
  strings: TemplateStringsArray,
  ...values: any[]
): string {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (values[i] || "");
  });
  return str;
}

function forceReflow(element: HTMLElement) {
  element.offsetHeight; // Reading offsetHeight to force reflow
}

export function ArticleViewer({
  content,
  translatedContent,
}: {
  content: string;
  translatedContent: string | null;
}) {
  const staticHTMLContent = literalTemplate`${content}`;

  const editor = useEditor({
    content: staticHTMLContent,
    editable: false,
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
      TextStyle,
      FontFamily.configure({
        types: ["textStyle"],
      }),
      Document,
      Text,
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
    ],
    editorProps: {
      attributes: {
        class: "prose dark:prose-dark",
      },
    },
    onUpdate: ({ editor }) => {
      forceReflow(editor.view.dom);
    },
  });

  useEffect(() => {
    if (editor && translatedContent !== null) {
      console.log("translatedContent", translatedContent);
      editor.commands.setContent(translatedContent);
    } else if (editor) {
      console.log("staticHTMLContent", staticHTMLContent);
      editor.commands.setContent(staticHTMLContent);
    }
  }, [editor, translatedContent, staticHTMLContent]);

  const { zoom, zoomIn, zoomOut, resetZoom } = useZoom();

  return (
    <div className="prose dark:prose-dark">
      <EditorContent
        editor={editor}
        style={{ zoom: zoom, transition: "zoom 0.2s" }}
      />
    </div>
  );
}

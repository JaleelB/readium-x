"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
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
import Highlight from "@tiptap/extension-highlight";
// import BubbleMenu from "@tiptap/extension-bubble-menu";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { useEffect } from "react";
import {
  useIsEditable,
  useIsReadingMode,
  useSetEditor,
} from "@/stores/article-store";
import { useZoom } from "@/stores/article-store";
import { FloatingBubbleMenu } from "@/components/bubble-menu";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import { cn } from "@/lib/utils"; // Make sure you have this utility function
import { useLocalStorage } from "@/hooks/use-local-storage";

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
  readingHistoryId,
}: {
  content: string;
  translatedContent: string | null;
  readingHistoryId: number;
}) {
  const zoom = useZoom();
  const isEditable = useIsEditable();
  const setEditor = useSetEditor();

  const [editedContent] = useLocalStorage<Record<number, string>>(
    "readiumx-edited-articles",
    {},
  );

  const staticHTMLContent = literalTemplate`${editedContent[readingHistoryId] || content}`;

  const editor = useEditor({
    content: staticHTMLContent || translatedContent,
    editable: isEditable,
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
      Highlight.configure({ multicolor: true }),
      Underline,
      Strike,
      Subscript,
      Superscript,
      FontFamily,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Color,
    ],
    editorProps: {
      attributes: {
        class: cn(
          "prose dark:prose-dark",
          "focus:outline-none", // Remove focus outline
        ),
      },
      handleKeyDown: (view, event) => {
        // Prevent deletion of content
        if (
          event.key === "Backspace" ||
          event.key === "Delete" ||
          (event.ctrlKey && event.key === "x") ||
          (event.metaKey && event.key === "x")
        ) {
          return true; // Prevents the default behavior
        }
      },
      handlePaste: (view, event, slice) => {
        // Prevent pasting content
        return true; // Prevents the default paste behavior
      },
      handleDrop: (view, event, slice, moved) => {
        // Prevent dropping content
        return true; // Prevents the default drop behavior
      },
    },
    onUpdate: ({ editor }) => {
      forceReflow(editor.view.dom);
    },
  });

  useEffect(() => {
    if (editor) {
      setEditor(editor);
    }
  }, [editor, setEditor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditable);
    }
  }, [editor, isEditable]);

  useEffect(() => {
    if (editor && translatedContent !== null) {
      editor.commands.setContent(translatedContent);
    } else if (editor) {
      editor.commands.setContent(staticHTMLContent);
    }
  }, [editor, translatedContent, staticHTMLContent]);

  return (
    <div
      className={cn(
        "prose dark:prose-dark relative",
        isEditable && "rounded-lg bg-muted/20 p-2",
      )}
      style={{
        appearance: "none",
      }}
    >
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          shouldShow={({ editor }) => {
            // Only show the bubble menu when the editor is editable
            return editor.isEditable && !editor.state.selection.empty;
          }}
        >
          <FloatingBubbleMenu />
        </BubbleMenu>
      )}
      <EditorContent
        editor={editor}
        className={cn(isEditable && "bg-muted/50")}
        style={{
          width: `${100 / zoom}%`,
          height: `${100 / zoom}%`,
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
          transition: "all 0.2s",
        }}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Bold,
  Italic,
  Underline,
  Strikethrough,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Editor } from "@tiptap/react";
import { useEditor } from "@/stores/article-store";

const colorPalette = [
  { hex: "#EF4444", tw: "bg-red-500" },
  { hex: "#EAB308", tw: "bg-yellow-500" },
  { hex: "#22C55E", tw: "bg-green-500" },
  { hex: "#3B82F6", tw: "bg-blue-500" },
  { hex: "#6366F1", tw: "bg-indigo-500" },
  { hex: "#A855F7", tw: "bg-purple-500" },
  { hex: "#EC4899", tw: "bg-pink-500" },
  { hex: "#6B7280", tw: "bg-gray-500" },
  { hex: "#F97316", tw: "bg-orange-500" },
  { hex: "#14B8A6", tw: "bg-teal-500" },
];

type Mode = "text" | "highlight";

const TextMode = ({ editor }: { editor: Editor | null }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="flex items-center space-x-1"
  >
    <Toggle
      aria-label="Toggle bold"
      className="h-8 w-8 p-0"
      pressed={editor?.isActive("bold")}
      onPressedChange={() => editor?.chain().focus().toggleBold().run()}
    >
      <Bold className="h-4 w-4" />
    </Toggle>
    <Toggle
      aria-label="Toggle italic"
      className="h-8 w-8 p-0"
      pressed={editor?.isActive("italic")}
      onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
    >
      <Italic className="h-4 w-4" />
    </Toggle>
    <Toggle
      aria-label="Toggle underline"
      className="h-8 w-8 p-0"
      pressed={editor?.isActive("underline")}
      onPressedChange={() => editor?.chain().focus().toggleUnderline().run()}
    >
      <Underline className="h-4 w-4" />
    </Toggle>
    <Toggle
      aria-label="Toggle strikethrough"
      className="h-8 w-8 p-0"
      pressed={editor?.isActive("strike")}
      onPressedChange={() => editor?.chain().focus().toggleStrike().run()}
    >
      <Strikethrough className="h-4 w-4" />
    </Toggle>
  </motion.div>
);

const HighlightMode = ({
  color,
  onColorChange,
  editor,
}: {
  color: string;
  onColorChange: (color: string) => void;
  editor: Editor | null;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="flex items-center gap-2"
  >
    {colorPalette.map((c) => (
      <motion.button
        key={c.hex}
        className={`h-6 w-6 rounded-full ${c.tw} ${
          color === c.hex ? `ring-2 ring-[${c.hex}] ring-offset-1` : ""
        }`}
        onClick={() => {
          onColorChange(c.hex);
          editor?.chain().focus().toggleHighlight({ color: c.hex }).run();
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      />
    ))}
  </motion.div>
);

export function FloatingBubbleMenu() {
  const [mode, setMode] = useState<Mode>("text");
  const [color, setColor] = useState(colorPalette[0]);
  const editor = useEditor();

  const toggleMode = () => {
    setMode(mode === "text" ? "highlight" : "text");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform select-none rounded-2xl border border-accent bg-white px-2 py-0.5 shadow-lg dark:bg-[#191919]"
    >
      <motion.div
        layout
        className="flex h-9 items-center"
        transition={{ duration: 0.3 }}
      >
        <motion.div layout className="flex items-center">
          <Toggle
            pressed={mode === "text"}
            onPressedChange={toggleMode}
            aria-label="Toggle mode"
            className={`h-7 rounded-xl px-2 py-0.5 ${mode === "text" ? "bg-accent" : "bg-accent"}`}
          >
            <motion.div layout className="flex items-center">
              {mode === "highlight" && <ChevronLeft className="mr-1 h-3 w-3" />}
              <span className="text-xs font-medium">
                {mode === "text" ? "Text" : "Highlight"}
              </span>
              {mode === "text" && <ChevronRight className="ml-1 h-3 w-3" />}
            </motion.div>
          </Toggle>
        </motion.div>
        <div
          className={`h-5 w-px border-l border-accent ${mode === "text" ? "ml-3 mr-1" : "ml-3 mr-4"}`}
        ></div>
        <AnimatePresence mode="wait">
          {mode === "text" ? (
            <TextMode key="text-mode" editor={editor} />
          ) : (
            <HighlightMode
              key="highlight-mode"
              color={color.hex}
              onColorChange={(newColor: string) =>
                setColor(
                  colorPalette.find((c) => c.hex === newColor) ||
                    colorPalette[0],
                )
              }
              editor={editor}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

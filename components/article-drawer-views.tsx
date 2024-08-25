"use client";

import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { Editor } from "@tiptap/react";

interface EditorProps {
  editor: Editor;
}

export function FontSettings({ editor }: EditorProps) {
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("sans-serif");

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0]);
    // editor.chain().focus().setFontSize(`${value[0]}px`).run();
  };

  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value);
    editor.chain().focus().setFontFamily(value).run();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Font Size: {fontSize}px</label>
        <Slider
          value={[fontSize]}
          onValueChange={handleFontSizeChange}
          max={48}
          min={12}
          step={1}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Font Family</label>
        <Select onValueChange={handleFontFamilyChange} value={fontFamily}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sans-serif">Sans-serif</SelectItem>
            <SelectItem value="serif">Serif</SelectItem>
            <SelectItem value="monospace">Monospace</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function HighlightTools({ editor }: EditorProps) {
  const [isHighlightMode, setIsHighlightMode] = useState(false);

  const toggleHighlightMode = () => {
    setIsHighlightMode(!isHighlightMode);
    // if (!isHighlightMode) {
    //   editor.commands.setHighlight();
    // } else {
    //   editor.commands.unsetHighlight();
    // }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          checked={isHighlightMode}
          onCheckedChange={toggleHighlightMode}
        />
        <label>Highlight Mode</label>
      </div>
      <p className="text-sm text-muted-foreground">
        {isHighlightMode
          ? "Select text to highlight. Click the switch again to exit highlight mode."
          : "Enable highlight mode to start highlighting text."}
      </p>
    </div>
  );
}

export function ShareOptions() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareOptions = [
    {
      name: "Twitter",
      icon: <Icons.twitter className="h-4 w-4" />,
      url: `https://twitter.com/intent/tweet?url=${shareUrl}`,
    },
    // {
    //   name: "Facebook",
    //   icon: <Icons.facebook className="h-4 w-4" />,
    //   url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    // },
    // {
    //   name: "LinkedIn",
    //   icon: <Icons.linkedin className="h-4 w-4" />,
    //   url: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`,
    // },
  ];

  const handleShare = (url: string) => {
    if (navigator.share) {
      navigator.share({
        title: "Article Title",
        text: "Check out this article",
        url: url,
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(url);
      // Show a toast notification that the URL was copied
      toast.success("URL copied to clipboard");
    }
  };

  return (
    <div className="space-y-2">
      {shareOptions.map((option) => (
        <Button
          key={option.name}
          variant="outline"
          className="w-full"
          onClick={() => handleShare(option.url)}
        >
          {option.icon}
          <span className="ml-2">Share on {option.name}</span>
        </Button>
      ))}
    </div>
  );
}

export function TranslationOptions({ editor }: EditorProps) {
  const [targetLanguage, setTargetLanguage] = useState("");

  const translateContent = async () => {
    if (!targetLanguage) return;

    const content = editor.getHTML();
    // Implement translation logic here
    // For example, using a translation API
    console.log(`Translating to ${targetLanguage}:`, content);
    // Then update the editor content with the translated text
    // editor.commands.setContent(translatedContent)
  };

  return (
    <div className="space-y-4">
      <Select onValueChange={setTargetLanguage} value={targetLanguage}>
        <SelectTrigger>
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="es">Spanish</SelectItem>
          <SelectItem value="fr">French</SelectItem>
          <SelectItem value="de">German</SelectItem>
          {/* Add more language options */}
        </SelectContent>
      </Select>
      <Button onClick={translateContent} disabled={!targetLanguage}>
        Translate
      </Button>
    </div>
  );
}

export function ReadingMode({ editor }: EditorProps) {
  const [isReadingMode, setIsReadingMode] = useState(false);

  const toggleReadingMode = (enabled: boolean) => {
    setIsReadingMode(enabled);
    const editorElement = editor.view.dom;
    if (enabled) {
      editorElement.classList.add("reading-mode");
    } else {
      editorElement.classList.remove("reading-mode");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch checked={isReadingMode} onCheckedChange={toggleReadingMode} />
        <label>Reading Mode</label>
      </div>
      <p className="text-sm text-muted-foreground">
        {isReadingMode
          ? "Reading mode is enabled. The layout has been optimized for easier reading."
          : "Enable reading mode for a more comfortable reading experience."}
      </p>
    </div>
  );
}

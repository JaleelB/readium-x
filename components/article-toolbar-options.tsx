"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { useSummary, useZoom, useZoomActions } from "@/stores/article-store";

import {
  useIsEditable,
  useToggleEditable,
  useIsReadingMode,
  useToggleReadingMode,
  useEditor,
} from "@/stores/article-store";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Subscript,
  Superscript,
  Eraser,
} from "lucide-react";
import { toast } from "sonner";

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => Promise<void>;
  isTranslating: boolean;
}

export function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  isTranslating,
}: LanguageSelectorProps) {
  const [isPending, startTransition] = useTransition();
  const [localSelectedLanguage, setLocalSelectedLanguage] =
    useState(selectedLanguage);

  useEffect(() => {
    setLocalSelectedLanguage(selectedLanguage);
  }, [selectedLanguage]);

  const handleLanguageSelect = async (language: string) => {
    if (!isTranslating && !isPending && language !== localSelectedLanguage) {
      setLocalSelectedLanguage(language);
      startTransition(async () => {
        try {
          await onLanguageChange(language);
        } catch (error) {
          console.error("Translation failed:", error);
          setLocalSelectedLanguage(selectedLanguage);
        }
      });
    }
  };

  return (
    <Command className="-mt-2 w-full rounded-lg bg-transparent">
      <CommandInput
        placeholder="Search language..."
        className="h-9"
        disabled={isTranslating || isPending}
      />
      <CommandList className="max-h-[140px] overflow-y-auto px-0">
        <CommandEmpty>No language found.</CommandEmpty>
        <CommandGroup className="px-0">
          {languages.map((language) => (
            <CommandItem
              key={language.value}
              onSelect={() => handleLanguageSelect(language.value)}
              className={`flex items-center justify-between text-sm ${
                isTranslating || isPending
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              disabled={isTranslating || isPending}
            >
              <span>{language.label}</span>
              {localSelectedLanguage === language.value && (
                <Check className="h-4 w-4" />
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

interface SummaryOptionProps {
  onSummarize: () => Promise<void>;
  isSummarizing: boolean;
}

export function SummaryOption({
  onSummarize,
  isSummarizing,
}: SummaryOptionProps) {
  const [isPending, startTransition] = useTransition();
  const summary = useSummary();

  const handleSummarizeClick = () => {
    if (!isSummarizing && !isPending && !summary) {
      startTransition(async () => {
        try {
          await onSummarize();
        } catch (error) {
          console.error("Summary generation failed:", error);
        }
      });
    }
  };

  const isLoading = isPending || isSummarizing;

  return (
    <div className="flex flex-col gap-1 px-2 pb-2">
      <div className="max-h-[200px] overflow-y-auto">
        {!summary ? (
          <>
            <h3 className="font-medium">Article Summary</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Click the button below to generate a summary.
            </p>
          </>
        ) : (
          <p className="mb-10 mt-2 text-sm">{summary}</p>
        )}
      </div>
      {!summary && (
        <Button
          onClick={handleSummarizeClick}
          disabled={isLoading}
          className="mt-2 w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Summary"
          )}
        </Button>
      )}
    </div>
  );
}

export function ZoomOption() {
  const zoom = useZoom();
  const zoomActions = useZoomActions();

  const { zoomIn, zoomOut, resetZoom } = useMemo(
    () => zoomActions,
    [zoomActions],
  );

  return (
    <div className="flex flex-col gap-2 px-2 pb-2">
      <div className="py-2 text-center text-5xl">
        {(zoom * 100).toFixed(0)}%
      </div>
      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" size="sm" onClick={zoomOut}>
          <Minus className="h-4 w-4" />
        </Button>
        <div className="h-2 w-full rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${((zoom - 0.5) / 4.5) * 100}%` }}
          />
        </div>
        <Button variant="outline" size="sm" onClick={zoomIn}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button size="sm" onClick={resetZoom} className="gap-2">
        <RotateCcw className="h-4 w-4" />
        Reset Zoom
      </Button>
    </div>
  );
}

const fontFamilies = [
  { value: "Arial", label: "Arial" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier", label: "Courier" },
  { value: "Verdana", label: "Verdana" },
  { value: "Georgia", label: "Georgia" },
];

export function EditOption() {
  const isEditable = useIsEditable();
  const toggleEditable = useToggleEditable();
  const editor = useEditor();

  useEffect(() => {
    if (isEditable) {
      toast.info("Editing mode enabled");
    }
  }, [isEditable]);

  const handleToggleEditable = () => {
    const wasEditable = isEditable;
    toggleEditable();
    if (wasEditable) {
      toast.info("Editing mode disabled.");
    }
  };

  const setFontFamily = (font: string) => {
    if (editor) {
      editor.commands.selectAll();
      editor.chain().focus().setFontFamily(font).run();
      editor.commands.setTextSelection({ from: 0, to: 0 });
    }
  };

  const clearFormatting = () => {
    if (editor) {
      editor
        .chain()
        .focus()
        .unsetAllMarks()
        .unsetFontFamily()
        .unsetTextAlign()
        .setTextSelection(editor.state.doc.content.size)
        .run();

      // Manually clear formatting for specific node types
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === "paragraph" || node.type.name === "heading") {
          editor
            .chain()
            .focus()
            .setNodeSelection(pos)
            .unsetAllMarks()
            .unsetFontFamily()
            .unsetTextAlign()
            .run();
        }
      });
    }
  };

  const saveChanges = () => {
    if (editor) {
      const content = editor.getHTML();
      console.log("Saving changes:", content);
      toast.success("Changes saved successfully");
    }
  };

  return (
    <div className="flex flex-col gap-2 px-2 pb-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Enable Editing</span>
        <Switch checked={isEditable} onCheckedChange={handleToggleEditable} />
      </div>
      {isEditable && (
        <div className="flex max-h-[250px] flex-col justify-between gap-4 overflow-y-auto border-t border-accent pt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Font Family</span>
            <Select onValueChange={setFontFamily}>
              <SelectTrigger
                className="w-[150px]"
                defaultValue={fontFamilies[0]?.value || "Arial"}
              >
                <SelectValue placeholder="Font Family" />
              </SelectTrigger>
              <SelectContent
                align="end"
                className="dark z-[1000] max-h-[100px] overflow-y-auto"
              >
                {fontFamilies.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="w-full"
              variant="destructive"
              onClick={clearFormatting}
            >
              <Eraser className="mr-2 h-4 w-4" />
              Clear Formatting
            </Button>
            <Button size="sm" className="w-full" onClick={saveChanges}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

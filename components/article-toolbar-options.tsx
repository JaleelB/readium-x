"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
  summary: string | null;
}

export function SummaryOption({
  onSummarize,
  isSummarizing,
  summary,
}: SummaryOptionProps) {
  const handleSummarizeClick = async () => {
    if (!summary && !isSummarizing) {
      await onSummarize();
    }
  };

  return (
    <div className="flex flex-col gap-1 px-2 pb-2">
      <div className="max-h-[200px] overflow-y-auto">
        {!summary && !isSummarizing && (
          <>
            <h3 className="font-medium">Article Summary</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Click the button below to generate a summary.
            </p>
          </>
        )}
        {isSummarizing && (
          <p className="mb-4 text-sm text-muted-foreground">
            Generating summary...
          </p>
        )}
        {summary && <p className="mb-10 mt-2 text-sm">{summary}</p>}
      </div>
      {!summary && (
        <Button
          onClick={handleSummarizeClick}
          disabled={isSummarizing}
          className="mt-2 w-full"
        >
          {isSummarizing ? (
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

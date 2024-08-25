import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  FontSettings,
  HighlightTools,
  ShareOptions,
  TranslationOptions,
  ReadingMode,
} from "./article-drawer-views";
import { Editor } from "@tiptap/react";
import { cn } from "@/lib/utils";
import {
  RemoveFormatting,
  Highlighter,
  Share2,
  Languages,
  BookOpen,
  LucideProps,
} from "lucide-react";
import { Icon, Icons } from "./icons";

interface ArticleDrawerProps {
  editor: Editor;
}

const options = [
  {
    id: "font",
    label: "Font Settings",
    component: FontSettings,
    icon: (props: LucideProps) => <RemoveFormatting {...props} />,
  },
  // {
  //   id: "highlight",
  //   label: "Highlight",
  //   component: HighlightTools,
  //   icon: (props: LucideProps) => <Highlighter {...props} />,
  // },
  {
    id: "share",
    label: "Share",
    component: ShareOptions,
    icon: (props: LucideProps) => <Share2 {...props} />,
  },
  {
    id: "translate",
    label: "Translation",
    component: TranslationOptions,
    icon: (props: LucideProps) => <Languages {...props} />,
  },
  {
    id: "reading",
    label: "Reading Mode",
    component: ReadingMode,
    icon: (props: LucideProps) => <BookOpen {...props} />,
  },
];

export function ArticleDrawer({
  // isOpen,
  // toggleOpen,
  editor,
}: ArticleDrawerProps) {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null,
  );
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOptionClick = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleBackClick = () => {
    setSelectedOption(null);
  };

  const SelectedComponent = options.find(
    (option) => option.id === selectedOption,
  )?.component;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <Button
          variant="outline"
          className={cn(
            "fixed bottom-8 left-6 gap-1 rounded-full border shadow-sm",
          )}
        >
          Article Options
          <Icons.chevronDown
            className={`h-4 w-4 rotate-180 text-muted-foreground`}
          />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className={cn(
          "fixed bottom-8 left-5 min-h-fit w-full max-w-[370px] rounded-3xl border bg-background p-6 shadow-sm transition-all duration-300",
        )}
      >
        <div className="h-full w-full">
          {selectedOption ? (
            <>
              <div className="mb-6 text-left">
                {options.find((option) => option.id === selectedOption)?.icon &&
                  React.createElement(
                    options.find((option) => option.id === selectedOption)!
                      .icon,
                    { className: "h-9 w-9" },
                  )}
                <h3 className="mt-2.5 text-xl font-semibold">
                  {
                    options.find((option) => option.id === selectedOption)
                      ?.label
                  }
                </h3>
              </div>

              {SelectedComponent && <SelectedComponent editor={editor} />}
              <div className="mt-6 flex items-center justify-between gap-4">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full rounded-full px-6 font-semibold"
                  onClick={handleBackClick}
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  className="w-full rounded-full px-6 font-semibold"
                >
                  Apply change
                </Button>
              </div>
            </>
          ) : (
            <>
              <SheetHeader
                className={cn(
                  "mb-4 block h-[48px] border-b border-[#F7F7F7] dark:border-input",
                )}
              >
                <SheetTitle className="text-left font-semibold">
                  Options Menu
                </SheetTitle>
              </SheetHeader>
              <ul className="grid h-full w-full grid-cols-2 gap-2">
                {options.map((option) => (
                  <li key={option.id}>
                    <Button
                      variant="outline"
                      className="flex h-20 w-full flex-col items-center justify-center gap-1 rounded-lg"
                      onClick={() => handleOptionClick(option.id)}
                    >
                      {/* <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary bg-gradient-to-b from-white/[3%] text-primary-foreground transition duration-200 ease-in-out"> */}
                      {option.icon &&
                        React.createElement(option.icon, {
                          className: "h-5 w-5",
                        })}
                      {/* </div> */}
                      {option.label}
                    </Button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

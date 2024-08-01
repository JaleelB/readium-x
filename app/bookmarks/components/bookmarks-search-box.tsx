import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type BookmarksSearchBoxProps = {
  debounceTimeoutMs?: number;
};

export function BookmarksSearchBox({
  debounceTimeoutMs = 300,
}: BookmarksSearchBoxProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get("search") ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedUpdateSearchParam = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, debounceTimeoutMs);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    // only focus on filter input when:
    // - user is not typing in an input or textarea
    // - there is no existing modal backdrop (i.e. no other modal is open)
    if (
      e.key === "/" &&
      target.tagName !== "INPUT" &&
      target.tagName !== "TEXTAREA"
    ) {
      e.preventDefault();
      inputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  // Update the search input value when the search query changes
  useEffect(() => {
    const search = searchParams.get("search");
    if (search !== null && search !== value) {
      setValue(search);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="relative w-full md:w-56 lg:w-64">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <Icons.search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        ref={inputRef}
        className="w-full justify-start whitespace-nowrap rounded-[0.5rem] border border-input bg-background px-10 py-2 text-sm font-normal shadow-none transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        placeholder="Search..."
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          debouncedUpdateSearchParam(e.target.value);
        }}
      />
      {value && (
        <button
          onClick={() => {
            setValue("");
            debouncedUpdateSearchParam("");
          }}
          className="absolute inset-y-0 right-0 flex items-center p-0 pr-4"
        >
          <Icons.closeCircled className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}

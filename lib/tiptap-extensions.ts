import { Mark, Node, mergeAttributes } from "@tiptap/react";
import { cn } from "./utils";

const CustomHeading = (level: number) =>
  Node.create({
    name: `heading${level}`,
    addAttributes() {
      return {
        class: {
          default: null,
          parseHTML: (element) => element.getAttribute("class"),
        },
        style: {
          default: null,
          parseHTML: (element) => element.getAttribute("style"),
        },
      };
    },
    content: "inline*",
    group: "block",
    defining: true,
    draggable: false,
    parseHTML() {
      return [
        {
          tag: `h${level}`,
          getAttrs: (element) => ({
            class: element.getAttribute("class"),
            style: element.getAttribute("style"),
          }),
        },
      ];
    },
    renderHTML({ node, HTMLAttributes }) {
      return [
        `h${level}`,
        mergeAttributes(HTMLAttributes, {
          class: cn(
            `font-sans ${
              level === 2
                ? "text-1xl break-normal font-sans font-bold text-gray-900 dark:text-gray-100 md:text-2xl"
                : level === 3
                  ? "text-1xl break-normal pt-12 font-sans font-bold text-gray-900 dark:text-gray-100 md:text-2xl"
                  : level === 4
                    ? "text-l break-normal pt-8 font-sans font-bold text-gray-900 dark:text-gray-100 md:text-xl"
                    : `${node.attrs.class}`
            } `,
          ),
          style: node.attrs.style,
        }),
        0,
      ];
    },
  });

const CustomBlockquote = Node.create({
  name: "blockquote",
  content: "block+",
  group: "block",
  defining: true,
  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => {
          return { class: attributes.class };
        },
      },
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          return { style: attributes.style };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "blockquote",
        getAttrs: (node) => ({
          class:
            node instanceof HTMLElement && node.getAttribute("class")
              ? {
                  class: node.getAttribute("class"),
                }
              : null,
          style:
            node instanceof HTMLElement && node.getAttribute("style")
              ? { style: node.getAttribute("style") }
              : null,
        }),
      },
    ];
  },
  renderHTML({ node, HTMLAttributes }) {
    return [
      "blockquote",
      mergeAttributes({
        ...HTMLAttributes,
        class: `${node.attrs.class} border-l-4 border-primary p-4 bg-muted text-muted-foreground dark:bg-muted-foreground dark:text-muted mt-5`,
        style:
          "box-shadow: inset 3px 0 0 0 rgb(209 207 239 / var(--tw-bg-opacity));",
      }),
      0,
    ];
  },
});

const CustomCodeBlock = Node.create({
  name: "codeBlock",
  content: "text*",
  marks: "",
  group: "block",
  code: true,
  defining: true,
  addAttributes() {
    return {
      class: {
        default:
          "language-none relative h-full w-full max-h-[500px] whitespace-pre-wrap rounded-lg py-4 px-6 text-sm border text-white/75",
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => {
          return { class: attributes.class };
        },
      },
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          return { style: attributes.style };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "pre",
        preserveWhitespace: "full",
        getAttrs: (node) => ({
          class:
            node instanceof HTMLElement && node.getAttribute("class")
              ? { class: node.getAttribute("class") }
              : null,
          style:
            node instanceof HTMLElement && node.getAttribute("style")
              ? { style: node.getAttribute("style") }
              : null,
        }),
      },
    ];
  },
  renderHTML({ HTMLAttributes, node }) {
    return [
      "pre",
      mergeAttributes({
        ...HTMLAttributes,
        class: `relative h-full w-full max-h-[650px] whitespace-pre-wrap mt-10 md:mt-12 rounded-lg p-8 text-sm border border-border text-white/75 mb-4 overflow-x-auto rounded-lg bg-zinc-950 dark:bg-zinc-900`,
      }),
      [
        "code",
        {
          class: "relative rounded font-mono text-sm",
        },
        0,
      ],
    ];
  },
});

const CustomImage = Node.create({
  name: "image",
  group: "block",
  draggable: true,
  atom: true,
  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => {
          return { class: attributes.class };
        },
      },
      src: {
        default: null,
        parseHTML: (element) =>
          element.getAttribute("src") || element.getAttribute("data-src"),
        renderHTML: (attributes) => {
          return { src: attributes.src };
        },
      },
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          return { style: attributes.style };
        },
      },
      alt: {
        default: null,
        parseHTML: (element) => element.getAttribute("alt"),
        renderHTML: (attributes) => {
          return { alt: attributes.alt };
        },
      },
      title: {
        default: null,
        parseHTML: (element) => element.getAttribute("title"),
        renderHTML: (attributes) => {
          return { title: attributes.title };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "img",
        getAttrs: (node) => ({
          class: node.getAttribute("class") || null,
          src: node.getAttribute("src") || node.getAttribute("data-src"), // Ensure src is taken either directly or from data-src
          style: node.getAttribute("style") || null,
          alt: node.getAttribute("alt") || null,
          title: node.getAttribute("title") || null,
        }),
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes), 0];
  },
});

const CustomFigcaption = Node.create({
  name: "figcaption",
  content: "text*", // allows inline nodes like text or other inline nodes
  group: "block",
  defining: true,
  addAttributes() {
    return {
      class: {
        default: "text-center text-sm text-gray-500",
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => {
          return {
            class: attributes.class,
          };
        },
      },
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          return { style: attributes.style };
        },
      },
    };
  },
  parseHTML() {
    return [{ tag: "figcaption" }];
  },
  renderHTML({ node, HTMLAttributes }) {
    return [
      "figcaption",
      mergeAttributes({
        ...HTMLAttributes,
        class:
          "mt-3 text-sm text-center text-muted-foreground dark:text-muted-foreground",
        style: node.attrs.style,
      }),
      0,
    ];
  },
});

const CustomFigure = Node.create({
  name: "figure",
  content: "image",
  group: "block",
  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => {
          return { class: attributes.class };
        },
      },
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          return { style: attributes.style };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "figure",
        getAttrs: (node) => ({
          class:
            node instanceof HTMLElement && node.getAttribute("class")
              ? { class: node.getAttribute("class") }
              : null,
          style:
            node instanceof HTMLElement && node.getAttribute("style")
              ? { style: node.getAttribute("style") }
              : null,
        }),
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["figure", mergeAttributes(HTMLAttributes), 0];
  },
});

const CustomParagraph = Node.create({
  name: "paragraph",
  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => {
          return { class: attributes.class };
        },
      },
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          return { style: attributes.style };
        },
      },
    };
  },
  content: "inline*",
  group: "block",
  draggable: false,
  parseHTML() {
    return [
      {
        tag: "p",
        getAttrs: (node) => ({
          class:
            node instanceof HTMLElement && node.getAttribute("class")
              ? { class: node.getAttribute("class") }
              : null,
          style:
            node instanceof HTMLElement && node.getAttribute("style")
              ? { style: node.getAttribute("style") }
              : null,
        }),
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "p",
      mergeAttributes({
        ...HTMLAttributes,
        class: node.attrs.class,
        style: node.attrs.style,
      }),
      0,
    ];
  },
});

const CustomStrong = Mark.create({
  name: "strong",
  parseHTML() {
    return [
      { tag: "strong" },
      {
        tag: "b",
        getAttrs: (node) => node.style.fontWeight !== "normal" && null,
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["strong", mergeAttributes(HTMLAttributes), 0];
  },
});

const CustomEmphasis = Mark.create({
  name: "emphasis",
  parseHTML() {
    return [{ tag: "em" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["em", mergeAttributes(HTMLAttributes), 0];
  },
});

const CustomLink = Mark.create({
  name: "link",
  addAttributes() {
    return {
      href: {},
      class: {
        default: "text-primary font-medium cursor-pointer underline",
      },
      target: {
        default: "_blank",
      },
      previewListener: {
        default: true,
      },
    };
  },
  inclusive: false,

  parseHTML() {
    return [
      {
        tag: "a[href]",
        getAttrs: (node) => ({
          href: node.getAttribute("href"),
          class:
            node.getAttribute("class") ||
            "text-primary font-medium cursor-pointer underline",
          target: node.getAttribute("target") || "_blank",
          previewListener: node.getAttribute("previewListener") || true,
        }),
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "a",
      mergeAttributes({
        ...HTMLAttributes,
        class: "text-primary font-medium cursor-pointer underline",
        target: "_blank",
        rel: "noopener noreferrer",
      }),
      0,
    ];
  },
});

// HTML text content elements to organize blocks or sections of content placed between the opening <body> and closing </body> tags.
const CustomDiv = Node.create({
  name: "div",
  content: "block+",
  group: "block",
  defining: true,
  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => ({ class: attributes.class }),
      },
      // style: {
      //   default: null,
      //   parseHTML: (element) => element.getAttribute("style"),
      //   renderHTML: (attributes) => ({ style: attributes.style }),
      // },
    };
  },
  parseHTML() {
    return [
      {
        tag: "div",
        getAttrs: (node) => ({
          class: node.getAttribute("class") || null,
          // style: node.getAttribute("style") || null,
        }),
      },
    ];
  },
  renderHTML({ node, HTMLAttributes }) {
    const { style, ...otherAttributes } = HTMLAttributes;
    return [
      "div",
      mergeAttributes({
        ...otherAttributes,
        class: node.attrs.class || null, // Ensure null defaults don't override
        // style: node.attrs.style || null,
      }),
      0,
    ];
  },
});

const CustomDL = Node.create({
  name: "dl",
  content: "dt dd",
  group: "block",
  defining: true,
  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => ({ class: attributes.class }),
      },
    };
  },
  parseHTML() {
    return [{ tag: "dl" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["dl", mergeAttributes(HTMLAttributes), 0];
  },
});

const CustomDT = Node.create({
  name: "dt",
  content: "inline*",
  group: "block",
  defining: true,
  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => ({ class: attributes.class }),
      },
    };
  },
  parseHTML() {
    return [{ tag: "dt" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["dt", mergeAttributes(HTMLAttributes), 0];
  },
});

const CustomDD = Node.create({
  name: "dd",
  content: "inline*",
  group: "block",
  defining: true,
  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => ({ class: attributes.class }),
      },
    };
  },
  parseHTML() {
    return [{ tag: "dd" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["dd", mergeAttributes(HTMLAttributes), 0];
  },
});

const CustomUL = Node.create({
  name: "ul",
  content: "li+",
  group: "block",
  defining: true,
  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
      },
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "ul",
        getAttrs: (element) => ({
          class: element.getAttribute("class") || null,
          style: element.getAttribute("style") || null,
        }),
      },
    ];
  },
  renderHTML({ node, HTMLAttributes }) {
    return [
      "ul",
      mergeAttributes({
        ...HTMLAttributes,
        class: `${node.attrs.class} list-disc pl-8 mt-2`,
      }),
      0,
    ];
  },
});

const CustomOL = Node.create({
  name: "ol",
  content: "li+",
  group: "block",
  defining: true,
  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
      },
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "ol",
        getAttrs: (element) => ({
          class: element.getAttribute("class") || null,
          style: element.getAttribute("style") || null,
        }),
      },
    ];
  },
  renderHTML({ HTMLAttributes, node }) {
    return [
      "ol",
      mergeAttributes({
        ...HTMLAttributes,
        class: `${node.attrs.class} list-decimal pl-8 mt-2`,
      }),
      0,
    ];
  },
});

const CustomLI = Node.create({
  name: "li",
  content: "inline*",
  group: "listItem",
  defining: true,
  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
      },
      // style: {
      //   default: null,
      //   parseHTML: (element) => element.getAttribute("style"),
      // },
    };
  },
  parseHTML() {
    return [
      {
        tag: "li",
        getAttrs: (element) => ({
          class: element.getAttribute("class") || null,
          // style: element.getAttribute("style") || null,
        }),
      },
    ];
  },
  renderHTML({ node, HTMLAttributes }) {
    const { style, ...otherAttributes } = HTMLAttributes;
    return [
      "li",
      mergeAttributes({
        ...otherAttributes,
        class: `${node.attrs.class} mt-3`,
      }),
      0,
    ];
  },
});

export {
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
  CustomDL,
  CustomDT,
  CustomDD,
  CustomUL,
  CustomOL,
  CustomLI,
};

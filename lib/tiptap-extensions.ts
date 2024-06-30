import { Mark, Node, mergeAttributes } from "@tiptap/react";

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
          class: `${node.attrs.class} my-4`,
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
        default: "pl-4 border-l-4 border-gray-500",
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
    return ["blockquote", mergeAttributes(HTMLAttributes), 0];
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
          "language-none relative h-full w-full max-h-[500px] whitespace-pre-wrap rounded-lg py-4 px-6 text-sm border text-white/75 bg-zinc-950 dark:bg-zinc-900",
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
          //   class:
          //     node instanceof HTMLElement && node.getAttribute("class")
          //       ? { class: node.getAttribute("class") }
          //       : null,
          style:
            node instanceof HTMLElement && node.getAttribute("style")
              ? { style: node.getAttribute("style") }
              : null,
        }),
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["pre", mergeAttributes(HTMLAttributes), ["code", 0]];
  },
});

const CustomImage = Node.create({
  name: "image",
  inline: true,
  group: "inline",
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
  renderHTML({ node, HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes), 0];
  },
});

const CustomFigcaption = Node.create({
  name: "figcaption",
  content: "inline*",
  addAttributes() {
    return {
      class: {
        default: "text-center text-sm text-gray-500",
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
        tag: "figcaption",
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
    return ["figcaption", mergeAttributes(HTMLAttributes), 0];
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
      mergeAttributes(HTMLAttributes, {
        class: `${node.attrs.class} text-muted-foreground dark:text-muted-foreground`,
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
        class: HTMLAttributes.class,
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
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => ({ style: attributes.style }),
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "div",
        getAttrs: (node) => ({
          class: node.getAttribute("class") || null,
          style: node.getAttribute("style") || null,
        }),
      },
    ];
  },
  renderHTML({ node, HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({
        ...HTMLAttributes,
        class: node.attrs.class || null, // Ensure null defaults don't override
        style: node.attrs.style || null,
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
  renderHTML({ HTMLAttributes }) {
    return ["ul", mergeAttributes(HTMLAttributes), 0];
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
  renderHTML({ HTMLAttributes }) {
    return ["ol", mergeAttributes(HTMLAttributes), 0];
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
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "li",
        getAttrs: (element) => ({
          class: element.getAttribute("class") || null,
          style: element.getAttribute("style") || null,
        }),
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["li", mergeAttributes(HTMLAttributes), 0];
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

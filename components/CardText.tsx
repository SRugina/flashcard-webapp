import { Dispatch, useCallback, useMemo } from "react";
import { Slate, Editable, withReact, RenderLeafProps } from "slate-react";
import { Node, Text, Range, createEditor, Path } from "slate";
import { withHistory } from "slate-history";
import { languages, Token, tokenize } from "prismjs";

// from Slate's markdown-preview example, extended with strikethrough, limited
// to just bold, italic, strikethrough, monospace, quotes, and simplified
(languages.markdown = languages.extend("markup", {})),
  languages.insertBefore("markdown", "prolog", {
    blockquote: { pattern: /^>(?:[\t ]*>)*/m, alias: "punctuation" },
    monospace: [{ pattern: /``.+?``|`[^`\n]+`/, alias: "keyword" }],
    strikethrough: {
      pattern: /(^|[^\\])([~])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
      lookbehind: !0,
      inside: { punctuation: /^[~]|[~]$/ },
    },
    bold: {
      pattern: /(^|[^\\])([*])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
      lookbehind: !0,
      inside: { punctuation: /^[*]|[*]$/ },
    },
    italic: {
      pattern: /(^|[^\\])([_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
      lookbehind: !0,
      inside: { punctuation: /^[_]|[_]$/ },
    },
  });

const CardText = ({
  content,
  setContent,
}: {
  content: Array<Node>;
  setContent: Dispatch<Array<Node>>;
}) => {
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const decorate = useCallback(([node, path]: [Node, Path]) => {
    const ranges: Array<Range> = [];

    if (!Text.isText(node)) {
      return ranges;
    }

    const getLength = (token: string | Token): number => {
      if (typeof token === "string") {
        return token.length;
      } else if (typeof token.content === "string") {
        return token.content.length;
      } else {
        return (token.content as Array<Token>).reduce(
          (l, t) => l + getLength(t),
          0
        );
      }
    };

    const tokens = tokenize(node.text, languages.markdown);
    let start = 0;

    for (const token of tokens) {
      const length = getLength(token);
      const end = start + length;

      if (typeof token !== "string") {
        ranges.push({
          [token.type]: true,
          anchor: { path, offset: start },
          focus: { path, offset: end },
        });
      }

      start = end;
    }

    return ranges;
  }, []);

  return (
    <Slate
      editor={editor}
      value={content}
      onChange={(value) => setContent(value)}
    >
      <Editable
        decorate={decorate}
        renderLeaf={renderLeaf}
        placeholder="Write some markdown..."
        className="focus:outline-none focus:ring-0"
      />
    </Slate>
  );
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  return (
    <span
      {...attributes}
      className={`${leaf.bold ? "font-bold" : ""} ${
        leaf.italic ? "italic" : ""
      } ${leaf.strikethrough ? "line-through" : ""} ${
        leaf.blockquote
          ? "inline-block border-l-4 border-nord5 pl-2 text-nord2"
          : ""
      } ${leaf.monospace ? "font-mono bg-nord5 p-0.5" : ""}`}
    >
      {children}
    </span>
  );
};

export default CardText;

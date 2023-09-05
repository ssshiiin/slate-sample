import { FC } from "react";
import {
  Descendant,
  Editor,
  Element,
  NodeEntry,
  Path,
  Range,
  Text,
  Transforms,
} from "slate";
import { RenderElementProps } from "slate-react";
import { TrBlock } from "./tr";
import { ToolAction } from "../../types/ToolAction";
import {
  AbstractBlockActions,
  AbstractBlockDeserializer,
  AbstractBlockSerializer,
} from "./AbstractBlock";
import { recursiveDeserialize } from "../../utils/deserializer";
import { jsx } from "slate-hyperscript";

export type TableBlock = {
  type: "table";
  children: TrBlock[];
};

export const RenderTableBlock: FC<RenderElementProps> = ({
  children,
  attributes,
}) => {
  return (
    <table {...attributes} className={"table"}>
      <tbody>{children}</tbody>
    </table>
  );
};

export class TableBlockActions
  extends AbstractBlockActions<TableBlock>
  implements ToolAction
{
  getType(): "table" {
    return "table";
  }

  apply(editor: Editor) {
    const { selection } = editor;
    if (!selection || Range.isExpanded(selection)) return;

    const table: TableBlock = {
      type: "table",
      children: [
        {
          type: "tr",
          children: [
            { type: "td", children: [{ text: "text" }] },
            { type: "td", children: [{ text: "text" }] },
          ],
        },
        {
          type: "tr",
          children: [
            { type: "td", children: [{ text: "text" }] },
            { type: "td", children: [{ text: "text" }] },
          ],
        },
      ],
    };

    const match = Editor.above(editor, {
      match: (n) => Element.isElement(n) && n.type === "paragraph",
    });

    if (!match) return;
    const [paragraph, path] = match;

    if (
      paragraph.children.length > 2 ||
      (Text.isText(paragraph.children[0]) && paragraph.children[0].text !== "")
    ) {
      editor.insertNode(table, {
        at: Path.next(path),
      });
      return;
    }

    Transforms.delete(editor, { at: path });
    Transforms.insertNodes(editor, table, { at: path });
  }

  click(editor: Editor): void {
    this.apply(editor);
  }

  clear(editor: Editor) {
    const match = this.findTable(editor);
    if (!match) return;
    const [, path] = match;

    Transforms.delete(editor, {
      at: path,
    });
    Transforms.insertNodes(
      editor,
      { type: "paragraph", children: [{ text: "" }] },
      {
        at: path,
      },
    );
  }

  addRight(editor: Editor) {
    const { selection } = editor;
    if (!selection || Range.isExpanded(selection)) return;
    const focusTrIndex = selection.focus.path[1];
    const focusTdIndex = selection.focus.path[2];
    if (focusTrIndex === undefined || focusTdIndex === undefined) return;

    const match = this.findTable(editor);
    if (!match) return;
    const [table, path] = match;
    if (!Element.isElement(table) || !this.is(table)) return;

    const newTable: TableBlock = {
      type: table.type,
      children: table.children
        .map((tr): TrBlock => {
          return {
            type: tr.type,
            children: [
              ...tr.children.slice(0, focusTdIndex + 1),
              { type: "td", children: [{ text: "text" }] },
              ...tr.children.slice(focusTdIndex + 1),
            ],
          };
        })
        .flat(),
    };

    Transforms.removeNodes(editor, { at: path });
    Transforms.insertNodes(editor, newTable, { at: path });
    Transforms.select(editor, {
      path: path.concat([focusTrIndex, focusTdIndex + 1, 0]),
      offset: 4,
    });
  }

  addLeft(editor: Editor) {
    const { selection } = editor;
    if (!selection || Range.isExpanded(selection)) return;
    const focusTrIndex = selection.focus.path[1];
    const focusTdIndex = selection.focus.path[2];
    if (focusTrIndex === undefined || focusTdIndex === undefined) return;

    const match = this.findTable(editor);
    if (!match) return;
    const [table, path] = match;
    if (!Element.isElement(table) || !this.is(table)) return;

    const newTable: TableBlock = {
      type: table.type,
      children: table.children
        .map((tr): TrBlock => {
          return {
            type: tr.type,
            children: [
              ...tr.children.slice(0, focusTdIndex),
              { type: "td", children: [{ text: "text" }] },
              ...tr.children.slice(focusTdIndex),
            ],
          };
        })
        .flat(),
    };

    Transforms.removeNodes(editor, { at: path });
    Transforms.insertNodes(editor, newTable, { at: path });
    Transforms.select(editor, {
      path: path.concat([focusTrIndex, focusTdIndex, 0]),
      offset: 4,
    });
  }

  addBottom(editor: Editor) {
    const { selection } = editor;
    if (!selection || Range.isExpanded(selection)) return;
    const focusTrIndex = selection.focus.path[1];
    const focusTdIndex = selection.focus.path[2];
    if (focusTrIndex === undefined || focusTdIndex === undefined) return;

    const match = this.findTable(editor);
    if (!match) return;
    const [table, path] = match;
    if (!Element.isElement(table) || !this.is(table)) return;

    const newTable: TableBlock = {
      type: table.type,
      children: [
        ...table.children.slice(0, focusTrIndex + 1),
        {
          type: "tr",
          children: table.children[0].children.map(() => {
            return { type: "td", children: [{ text: "text" }] };
          }),
        },
        ...table.children.slice(focusTrIndex + 1),
      ],
    };

    Transforms.removeNodes(editor, { at: path });
    Transforms.insertNodes(editor, newTable, { at: path });
    Transforms.select(editor, {
      path: path.concat([focusTrIndex + 1, focusTdIndex, 0]),
      offset: 4,
    });
  }

  addTop(editor: Editor) {
    const { selection } = editor;
    if (!selection || Range.isExpanded(selection)) return;
    const focusTrIndex = selection.focus.path[1];
    const focusTdIndex = selection.focus.path[2];
    if (focusTrIndex === undefined || focusTdIndex === undefined) return;

    const match = this.findTable(editor);
    if (!match) return;
    const [table, path] = match;
    if (!Element.isElement(table) || !this.is(table)) return;

    const newTable: TableBlock = {
      type: table.type,
      children: [
        ...table.children.slice(0, focusTrIndex),
        {
          type: "tr",
          children: table.children[0].children.map(() => {
            return { type: "td", children: [{ text: "text" }] };
          }),
        },
        ...table.children.slice(focusTrIndex),
      ],
    };

    Transforms.removeNodes(editor, { at: path });
    Transforms.insertNodes(editor, newTable, { at: path });
    Transforms.select(editor, {
      path: path.concat([focusTrIndex, focusTdIndex, 0]),
      offset: 4,
    });
  }

  removeRow(editor: Editor) {
    const { selection } = editor;
    if (!selection || Range.isExpanded(selection)) return;
    const [match] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === "tr",
    });

    const [, path] = match;

    Transforms.removeNodes(editor, { at: path });
  }

  removeColumn(editor: Editor) {
    const { selection } = editor;
    if (!selection || Range.isExpanded(selection)) return;
    const focusTdIndex = selection.focus.path[2];
    if (focusTdIndex === undefined) return;
    const match = this.findTable(editor);
    if (!match) return;
    const [table, path] = match;
    if (!Element.isElement(table) || !this.is(table)) return;
    table.children.forEach((_tr, index) => {
      Transforms.removeNodes(editor, {
        at: path.concat([index, focusTdIndex]),
      });
    });
  }

  private findTable(editor: Editor): NodeEntry | undefined {
    return Editor.above(editor, {
      match: (n) => {
        return Element.isElement(n) && n.type === "table";
      },
    });
  }
}

export class TableBlockSerializer extends AbstractBlockSerializer<TableBlock> {}
export class TableBlockDeserializer extends AbstractBlockDeserializer {
  deserialize(): Descendant {
    return jsx(
      "element",
      { type: "table" },
      Array.from(this.node.childNodes).map(this.deserializeTbody),
    );
  }

  private deserializeTbody(node: ChildNode): Descendant[] {
    if (node.nodeName === "TBODY") {
      return Array.from(node.childNodes).map(recursiveDeserialize);
    }
    throw new Error(`This code should not be called: ${node.nodeName}`);
  }
}

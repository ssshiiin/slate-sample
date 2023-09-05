import { Editor, Element, Path, Point, Range, Transforms } from "slate";

export const withEditor = (editor: Editor): Editor => {
  const {
    isInline,
    deleteBackward,
    deleteForward,
    insertBreak,
    insertSoftBreak,
  } = editor;

  const customInline = ["mlg", "i", "ref", "ruby", "rt"];
  editor.isInline = (element) => {
    if (customInline.includes(element.type)) {
      return true;
    }
    return isInline(element);
  };

  editor.deleteBackward = (unit) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [cell] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) && Element.isElement(n) && n.type === "td",
      });

      if (cell) {
        const [, cellPath] = cell;
        const start = Editor.start(editor, cellPath);

        if (Point.equals(selection.anchor, start)) {
          return;
        }
      }
    }

    deleteBackward(unit);
  };

  editor.deleteForward = (unit) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [cell] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) && Element.isElement(n) && n.type === "td",
      });

      if (cell) {
        const [, cellPath] = cell;
        const end = Editor.end(editor, cellPath);

        if (Point.equals(selection.anchor, end)) {
          return;
        }
      }
    }

    deleteForward(unit);
  };

  editor.insertBreak = () => {
    const { selection } = editor;

    if (!selection) {
      insertBreak();
      return;
    }

    // customInline
    const [inline] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && customInline.includes(n.type),
    });

    if (inline) {
      return;
    }

    // table
    const [table] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === "table",
    });

    if (table) {
      return;
    }

    insertBreak();
  };

  editor.insertSoftBreak = () => {
    const { selection } = editor;

    if (!selection) {
      insertBreak();
      return;
    }

    // customInline
    const [inline] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && customInline.includes(n.type),
    });

    if (inline) {
      return;
    }

    // table
    const [match] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === "table",
    });

    if (match) {
      const [, path] = match;
      if (selection && Range.isCollapsed(selection)) {
        Transforms.insertNodes(
          editor,
          {
            type: "paragraph",
            children: [{ text: "" }],
          },
          { at: Path.next(path) },
        );
        Transforms.select(editor, {
          path: Path.next(path).concat([0]),
          offset: 0,
        });
      }
      return;
    }
  };
  return editor;
};

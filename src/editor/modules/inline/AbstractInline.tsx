import { Descendant, Editor, Element, Path, Range, Transforms } from "slate";
import { CustomElement, CustomInline } from "../../types/editor";
import { ElementSerializer, Tag } from "../../utils/serializer";
import { jsx } from "slate-hyperscript";
import { ElementDeserializer } from "../../utils/deserializer";

export abstract class AbstractInlineActions<T extends CustomInline> {
  abstract getType(): T["type"];

  is(element: CustomElement): element is T {
    return element.type === this.getType();
  }

  isActive(editor: Editor): boolean {
    const [match] = editor.nodes({
      match: (n) => Element.isElement(n) && n.type === this.getType(),
    });
    return !!match;
  }

  wrap(editor: Editor, element: T): void {
    const { selection } = editor;
    if (!selection) return;
    if (Range.isCollapsed(selection)) return;
    if (!Path.equals(selection.anchor.path, selection.focus.path)) {
      alert("複数項目にまたがる選択はできません");
      return;
    }

    Transforms.wrapNodes(editor, element, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }

  unwrap(editor: Editor): void {
    Transforms.unwrapNodes(editor, {
      match: (n) => Element.isElement(n) && n.type === this.getType(),
    });
  }
}

export class AbstractInlineSerializer<T extends CustomInline>
  implements ElementSerializer
{
  constructor(protected element: T) {}

  serialize(): Tag {
    return {
      opening: `<${this.element.type}>`,
      closing: `</${this.element.type}>`,
    };
  }

  getChildren(): Descendant[] {
    return this.element.children;
  }
}

export class AbstractInlineDeserializer implements ElementDeserializer {
  constructor(protected node: HTMLElement) {}
  deserialize(recursive: (node: ChildNode) => Descendant): Descendant {
    return jsx(
      "element",
      { type: this.node.nodeName.toLowerCase() },
      Array.from(this.node.childNodes).map(recursive),
    );
  }
}

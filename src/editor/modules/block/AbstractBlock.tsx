import { Descendant, Editor, Element } from "slate";
import { CustomElement, CustomBlock } from "../../types/editor";
import { ElementSerializer, Tag } from "../../utils/serializer";
import { jsx } from "slate-hyperscript";
import { ElementDeserializer } from "../../utils/deserializer";

export abstract class AbstractBlockActions<T extends CustomBlock> {
  constructor() {}
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
}

export class AbstractBlockSerializer<T extends CustomBlock>
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

export class AbstractBlockDeserializer implements ElementDeserializer {
  constructor(protected node: HTMLElement) {}
  deserialize(recursive: (node: ChildNode) => Descendant): Descendant {
    return jsx(
      "element",
      { type: this.node.nodeName.toLowerCase() },
      Array.from(this.node.childNodes).map(recursive),
    );
  }
}

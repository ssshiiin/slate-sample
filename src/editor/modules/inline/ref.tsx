import { FC } from "react";
import { Descendant, Editor, Range, Transforms } from "slate";
import { RenderElementProps } from "slate-react";
import { CustomInline, CustomLeaf } from "../../types/editor";
import { Tag } from "../../utils/serializer";
import InlineChromiumBugfix from "../../components/InlineChromiumBugfix";
import { ToolAction } from "../../types/ToolAction";
import { ModalProps } from "../../components/modal/Modal";
import {
  AbstractInlineActions,
  AbstractInlineDeserializer,
  AbstractInlineSerializer,
} from "./AbstractInline";
import { recursiveDeserialize } from "../../utils/deserializer";
import { jsx } from "slate-hyperscript";

export type RefInline = {
  type: "ref";
  url: string;
  children: (CustomLeaf | CustomInline)[];
};

export const RenderRefInline: FC<RenderElementProps> = ({
  element,
  children,
  attributes,
}) => {
  if (element.type !== "ref") return null;
  return (
    <a {...attributes} onClick={(ev) => ev.preventDefault()} href={element.url}>
      <InlineChromiumBugfix />
      {children}
      <InlineChromiumBugfix />
    </a>
  );
};

export class RefInlineActions
  extends AbstractInlineActions<RefInline>
  implements ToolAction
{
  constructor(private modal?: ModalProps) {
    super();
  }

  getType(): "ref" {
    return "ref";
  }

  apply(editor: Editor, url: string): void {
    const { selection } = editor;
    if (!selection) return;
    const isCollapsed = Range.isCollapsed(selection);

    const ref: RefInline = {
      type: "ref",
      url: url,
      children: isCollapsed ? [{ text: url }] : [],
    };

    if (isCollapsed) {
      Transforms.insertNodes(editor, ref);
    } else {
      super.wrap(editor, ref);
    }
  }

  click(): void {
    this.modal?.onOpen();
  }

  clear(editor: Editor): void {
    super.unwrap(editor);
  }
}

export class RefInlineSerializer extends AbstractInlineSerializer<RefInline> {
  serialize(): Tag {
    return {
      opening: `<${this.element.type} href=${this.element.url}>`,
      closing: `</${this.element.type}>`,
    };
  }
}

export class RefInlineDeserializer extends AbstractInlineDeserializer {
  deserialize(): Descendant {
    return jsx(
      "element",
      {
        type: "ref",
        url: this.node.getAttribute("href") || "",
      },
      [
        { text: "" },
        ...Array.from(this.node.childNodes).map(recursiveDeserialize),
        { text: "" },
      ],
    );
  }
}

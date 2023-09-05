import { FC } from "react";
import { Editor, Element, Range, Selection, Transforms } from "slate";
import { RenderElementProps } from "slate-react";
import { CustomInline, CustomLeaf } from "../../types/editor";
import { Ruby } from "../../components/modal/RubyModal";
import InlineChromiumBugfix from "../../components/InlineChromiumBugfix";
import { ToolAction } from "../../types/ToolAction";
import { ModalProps } from "../../components/modal/Modal";
import {
  AbstractInlineActions,
  AbstractInlineDeserializer,
  AbstractInlineSerializer,
} from "./AbstractInline";

export type RubyInline = {
  type: "ruby";
  children: (CustomLeaf | CustomInline)[];
};

export const RenderRubyInline: FC<RenderElementProps> = ({
  children,
  attributes,
}) => {
  return (
    <span
      {...attributes}
      onClick={(ev) => ev.preventDefault()}
      className={"inline"}
    >
      <InlineChromiumBugfix />
      {children}
      <span contentEditable={false} className={"inline-asist"}>
        rb
      </span>
      <InlineChromiumBugfix />
    </span>
  );
};

export class RubyInlineActions
  extends AbstractInlineActions<RubyInline>
  implements ToolAction
{
  constructor(private modal?: ModalProps) {
    super();
  }

  getType(): "ruby" {
    return "ruby";
  }

  isActive(editor: Editor): boolean {
    const [match] = editor.nodes({
      match: (n) =>
        Element.isElement(n) && (n.type === this.getType() || n.type === "rt"),
    });
    return !!match;
  }

  apply(editor: Editor, rubys: Ruby[]) {
    const { selection } = editor;
    if (!selection) return;

    const children: RubyInline["children"] = rubys.reduce((acc, item) => {
      return [
        ...acc,
        { text: item.body },
        { type: "rt", children: [{ text: item.rt }] },
      ];
    }, [] as RubyInline["children"]);

    editor.insertNode({
      type: "ruby",
      children: children,
    });
  }

  unwrap(editor: Editor) {
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        Element.isElement(n) && (n.type === "ruby" || n.type === "rt"),
    });
  }

  click(editor: Editor): void {
    this.modal?.onOpen();
  }

  clear(editor: Editor): void {
    this.unwrap(editor);
  }
}

export class RubyInlineSerializer extends AbstractInlineSerializer<RubyInline> {}
export class RubyInlineDeserializer extends AbstractInlineDeserializer {}

import { FC } from "react";
import { RenderElementProps } from "slate-react";
import { CustomInline, CustomLeaf } from "../../types/editor";
import InlineChromiumBugfix from "../../components/InlineChromiumBugfix";
import { ToolAction } from "../../types/ToolAction";
import {
  AbstractInlineActions,
  AbstractInlineDeserializer,
  AbstractInlineSerializer,
} from "./AbstractInline";
import { Editor } from "slate";

export type IInline = {
  type: "i";
  children: (CustomLeaf | CustomInline)[];
};

export const RenderIInline: FC<RenderElementProps> = ({
  children,
  attributes,
}) => {
  return (
    <i {...attributes} onClick={(ev) => ev.preventDefault()}>
      <InlineChromiumBugfix />
      {children}
      <InlineChromiumBugfix />
    </i>
  );
};

export class IInlineActions
  extends AbstractInlineActions<IInline>
  implements ToolAction
{
  getType(): "i" {
    return "i";
  }

  click(editor: Editor): void {
    super.wrap(editor, {
      type: this.getType(),
      children: [],
    });
  }

  clear(editor: Editor): void {
    super.unwrap(editor);
  }
}

export class IInlineSerializer extends AbstractInlineSerializer<IInline> {}
export class IInlineDeserializer extends AbstractInlineDeserializer {}

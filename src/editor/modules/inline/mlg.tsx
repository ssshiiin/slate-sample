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

export type MlgInline = {
  type: "mlg";
  children: (CustomLeaf | CustomInline)[];
};

export const RenderMlgInline: FC<RenderElementProps> = ({
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
        かな
      </span>
      <InlineChromiumBugfix />
    </span>
  );
};

export class MlgInlineActions
  extends AbstractInlineActions<MlgInline>
  implements ToolAction
{
  getType(): "mlg" {
    return "mlg";
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

export class MlgInlineSerializer extends AbstractInlineSerializer<MlgInline> {}
export class MlgInlineDeserializer extends AbstractInlineDeserializer {}

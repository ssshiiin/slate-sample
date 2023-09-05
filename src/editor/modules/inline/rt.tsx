import { FC } from "react";
import { RenderElementProps } from "slate-react";
import { CustomInline, CustomLeaf } from "../../types/editor";
import InlineChromiumBugfix from "../../components/InlineChromiumBugfix";
import {
  AbstractInlineActions,
  AbstractInlineDeserializer,
  AbstractInlineSerializer,
} from "./AbstractInline";

export type RtInline = {
  type: "rt";
  children: (CustomLeaf | CustomInline)[];
};

export const RenderRtInline: FC<RenderElementProps> = ({
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
        rt
      </span>
      <InlineChromiumBugfix />
    </span>
  );
};

export class RtInlineActions extends AbstractInlineActions<RtInline> {
  getType(): "rt" {
    return "rt";
  }
}

export class RtInlineSerializer extends AbstractInlineSerializer<RtInline> {}
export class RtInlineDeserializer extends AbstractInlineDeserializer {}

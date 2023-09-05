import { FC } from "react";
import { RenderElementProps } from "slate-react";
import { CustomInline, CustomLeaf } from "../../types/editor";
import { Tag } from "../../utils/serializer";
import {
  AbstractBlockActions,
  AbstractBlockDeserializer,
  AbstractBlockSerializer,
} from "./AbstractBlock";

export type ParagraphBlock = {
  type: "paragraph";
  children: (CustomLeaf | CustomInline)[];
};

export const RenderParagraphBlock: FC<RenderElementProps> = ({
  children,
  attributes,
}) => {
  return <p {...attributes}>{children}</p>;
};

export class ParagraphBlockActions extends AbstractBlockActions<ParagraphBlock> {
  getType(): "paragraph" {
    return "paragraph";
  }
}

export class ParagraphBlockSerializer extends AbstractBlockSerializer<ParagraphBlock> {
  serialize(): Tag {
    return {
      opening: "",
      closing: "",
    };
  }
}
export class ParagraphBlockDeserializer extends AbstractBlockDeserializer {}

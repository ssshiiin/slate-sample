import { FC } from "react";
import { RenderElementProps } from "slate-react";
import { CustomLeaf } from "../../types/editor";
import {
  AbstractBlockActions,
  AbstractBlockDeserializer,
  AbstractBlockSerializer,
} from "./AbstractBlock";
import { Descendant } from "slate";
import { jsx } from "slate-hyperscript";

export type TdBlock = {
  type: "td";
  children: CustomLeaf[];
};

export const RenderTdBlock: FC<RenderElementProps> = (
  props: RenderElementProps,
) => {
  return (
    <td {...props.attributes} className={"td"}>
      {props.children}
    </td>
  );
};

export class TdBlockActions extends AbstractBlockActions<TdBlock> {
  getType(): "td" {
    return "td";
  }
}

export class TdBlockSerializer extends AbstractBlockSerializer<TdBlock> {}
export class TdBlockDeserializer extends AbstractBlockDeserializer {
  deserialize(recursive: (node: ChildNode) => Descendant): Descendant {
    return jsx(
      "element",
      { type: this.node.nodeName.toLowerCase() },
      this.node.childNodes.length === 0
        ? [jsx("text", { text: "" })]
        : Array.from(this.node.childNodes).map(recursive),
    );
  }
}

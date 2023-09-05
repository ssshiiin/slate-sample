import { FC } from "react";
import { RenderElementProps } from "slate-react";
import { TdBlock } from "./td";
import {
  AbstractBlockActions,
  AbstractBlockDeserializer,
  AbstractBlockSerializer,
} from "./AbstractBlock";

export type TrBlock = {
  type: "tr";
  children: TdBlock[];
};

export const RenderTrBlock: FC<RenderElementProps> = (
  props: RenderElementProps,
) => {
  return (
    <tr {...props.attributes} className={"tr"}>
      {props.children}
    </tr>
  );
};

export class TrBlockActions extends AbstractBlockActions<TrBlock> {
  getType(): "tr" {
    return "tr";
  }
}

export class TrBlockSerializer extends AbstractBlockSerializer<TrBlock> {}
export class TrBlockDeserializer extends AbstractBlockDeserializer {}

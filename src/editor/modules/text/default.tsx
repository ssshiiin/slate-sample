import { FC } from "react";
import { Text } from "slate";
import { RenderLeafProps } from "slate-react";
import { jsx } from "slate-hyperscript";
import { TextSerializer } from "../../utils/serializer";
import { TextDeserializer } from "../../utils/deserializer";

export type DefaultText = {
  text: string;
};

export const RenderDefaultText: FC<RenderLeafProps> = ({
  leaf,
  children,
  attributes,
}) => {
  return (
    <span
      // The following is a workaround for a Chromium bug where,
      // if you have an inline at the end of a block,
      // clicking the end of a block puts the cursor inside the inline
      // instead of inside the final {text: ''} node
      // https://github.com/ianstormtaylor/slate/issues/4704#issuecomment-1006696364
      style={(() => {
        if (leaf.text !== "") return;
        return { paddingLeft: "0.1px" };
      })()}
      {...attributes}
    >
      {children}
    </span>
  );
};

export class DefaultTextSerializer implements TextSerializer {
  constructor(private element: Text) {}
  serialize(): string {
    return this.element.text;
  }
}

export class DefaultTextDeserializer implements TextDeserializer {
  constructor(private node: ChildNode) {}
  deserialize(): Text {
    return jsx("text", { text: this.node.textContent });
  }
}

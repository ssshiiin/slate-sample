import { RenderElementProps } from "slate-react";
import { RenderMlgInline } from "./inline/mlg";
import { RenderIInline } from "./inline/i";
import { RenderRefInline } from "./inline/ref";
import { RenderRubyInline } from "./inline/ruby";
import { RenderRtInline } from "./inline/rt";
import { RenderTableBlock } from "./block/table";
import { RenderTrBlock } from "./block/tr";
import { RenderTdBlock } from "./block/td";
import { RenderParagraphBlock } from "./block/paragraph";

const RenderElement = (props: RenderElementProps): JSX.Element => {
  const type = props.element.type;
  switch (type) {
    case "mlg":
      return <RenderMlgInline {...props} />;
    case "i":
      return <RenderIInline {...props} />;
    case "ref":
      return <RenderRefInline {...props} />;
    case "ruby":
      return <RenderRubyInline {...props} />;
    case "rt":
      return <RenderRtInline {...props} />;
    case "table":
      return <RenderTableBlock {...props} />;
    case "tr":
      return <RenderTrBlock {...props} />;
    case "td":
      return <RenderTdBlock {...props} />;
    case "paragraph":
      return <RenderParagraphBlock {...props} />;
    default:
      const never: never = type;
      throw new Error(`This code should not be called: ${never}`);
  }
};

export default RenderElement;

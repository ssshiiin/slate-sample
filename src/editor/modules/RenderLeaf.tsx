import { RenderLeafProps } from "slate-react";
import { RenderDefaultText } from "./text/default";

const RenderLeaf = (props: RenderLeafProps): JSX.Element => {
  return <RenderDefaultText {...props} />;
};

export default RenderLeaf;

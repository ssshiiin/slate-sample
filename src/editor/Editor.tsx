import { FC, useState } from "react";
import { Descendant, Transforms, createEditor } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";
import ToolMenu, { Tools } from "./components/tools/ToolMenu";
import { deserialize } from "./utils/deserializer";
import { onKeyDown } from "./utils/keyBinding";
import { serialize } from "./utils/serializer";
import { Provider } from "./provider/Provider";
import Modals from "./Modals";
import RenderElement from "./modules/RenderElement";
import RenderLeaf from "./modules/RenderLeaf";
import { withEditor } from "./utils/withEditor";

type Props = {
  onChange: (value: string) => void;
  value: string;
  tools: Tools[];
};

const Editor: FC<Props> = ({ onChange, value, tools }) => {
  const [editor] = useState(() =>
    withEditor(withReact(withHistory(createEditor()))),
  );

  const wrapOnChange = (value: Descendant[]) => {
    console.log(value);
    onChange(serialize(editor, value));
  };

  return (
    <Provider>
      <Slate
        editor={editor}
        initialValue={deserialize(value)}
        onChange={wrapOnChange}
      >
        <ToolMenu tools={tools} />
        <Editable
          renderElement={RenderElement}
          renderLeaf={RenderLeaf}
          onKeyDown={onKeyDown(editor)}
          style={{
            minWidth: "500px",
            minHeight: "200px",
            backgroundColor: "white",
            color: "black",
            padding: "8px",
          }}
          onPaste={(e) => {
            if (confirm("Are you sure you want to paste?")) {
              console.log(e.clipboardData.getData("text/plain"));
              Transforms.removeNodes(editor, { at: [0] });
              Transforms.insertNodes(
                editor,
                deserialize(e.clipboardData.getData("text/plain")),
              );
            }
          }}
        />
        <Modals />
      </Slate>
    </Provider>
  );
};

export default Editor;

import { FC } from "react";
import { useSlate } from "slate-react";
import { ToolAction } from "../../types/ToolAction";
import { AbstractInlineActions } from "../../modules/inline/AbstractInline";
import { CustomBlock, CustomInline } from "../../types/editor";
import { AbstractBlockActions } from "../../modules/block/AbstractBlock";

type Props = {
  label: string;
  actions: (
    | AbstractInlineActions<CustomInline>
    | AbstractBlockActions<CustomBlock>
  ) &
    ToolAction;
};

const ToolButton: FC<Props> = ({ label, actions }) => {
  const editor = useSlate();

  const activeStyle = (() => {
    return { borderColor: actions.isActive(editor) ? "blue" : "black" };
  })();

  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        if (!editor.selection) return;

        if (actions.isActive(editor)) {
          actions.clear(editor);
          return;
        }
        actions.click(editor);
      }}
      style={activeStyle}
    >
      {label}
    </button>
  );
};

export default ToolButton;

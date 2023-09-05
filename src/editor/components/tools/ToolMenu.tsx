import { FC, Fragment } from "react";
import { useSlate } from "slate-react";
import { useRubyModal } from "../../hooks/useRubyModal";
import { useRefModal } from "../../hooks/useRefModal";
import ToolButton from "./ToolButton";
import TableOperations from "./TableOperation";
import { MlgInlineActions } from "../../modules/inline/mlg";
import { RefInlineActions } from "../../modules/inline/ref";
import { RubyInlineActions } from "../../modules/inline/ruby";
import { IInlineActions } from "../../modules/inline/i";
import { TableBlockActions } from "../../modules/block/table";

export type Tools = "ref" | "ruby" | "mlg" | "i" | "table";

const ToolMenu: FC<{ tools: Tools[] }> = ({ tools }) => {
  const editor = useSlate();
  const rubyModalProps = useRubyModal();
  const refModalProps = useRefModal();
  return (
    <div>
      {tools.map((tool) => {
        switch (tool) {
          case "ref":
            return (
              <ToolButton
                key={`tool-menu-${tool}`}
                label={tool}
                actions={new RefInlineActions(refModalProps)}
              />
            );
          case "ruby":
            return (
              <ToolButton
                key={`tool-menu-${tool}`}
                label={tool}
                actions={new RubyInlineActions(rubyModalProps)}
              />
            );
          case "i":
            return (
              <ToolButton
                key={`tool-menu-${tool}`}
                label={tool}
                actions={new IInlineActions()}
              />
            );
          case "mlg":
            return (
              <ToolButton
                key={`tool-menu-${tool}`}
                label={tool}
                actions={new MlgInlineActions()}
              />
            );
          case "table":
            return (
              <Fragment key={`tool-menu-${tool}`}>
                <ToolButton label={tool} actions={new TableBlockActions()} />
                {new TableBlockActions().isActive(editor) && (
                  <TableOperations />
                )}
              </Fragment>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default ToolMenu;

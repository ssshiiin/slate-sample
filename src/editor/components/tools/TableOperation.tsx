import { Fragment } from "react";
import { useSlate } from "slate-react";
import { TableBlockActions } from "../../modules/block/table";

const TableOperations = () => {
  const editor = useSlate();
  const actions = new TableBlockActions();
  return (
    <Fragment>
      <button
        onMouseDown={(event) => {
          event.preventDefault();
          actions.addLeft(editor);
        }}
      >
        ← +
      </button>
      <button
        onMouseDown={(event) => {
          event.preventDefault();
          actions.addRight(editor);
        }}
      >
        → +
      </button>
      <button
        onMouseDown={(event) => {
          event.preventDefault();
          actions.removeRow(editor);
        }}
      >
        行 -
      </button>
      <button
        onMouseDown={(event) => {
          event.preventDefault();
          actions.addTop(editor);
        }}
      >
        ↑ +
      </button>
      <button
        onMouseDown={(event) => {
          event.preventDefault();
          actions.addBottom(editor);
        }}
      >
        ↓ +
      </button>
      <button
        onMouseDown={(event) => {
          event.preventDefault();
          actions.removeColumn(editor);
        }}
      >
        列 -
      </button>
    </Fragment>
  );
};

export default TableOperations;

import { Editor } from "slate";

export interface ToolAction {
  click: (editor: Editor) => void;
  clear: (editor: Editor) => void;
}

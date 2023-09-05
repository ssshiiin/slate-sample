import { Editor, Range, Transforms } from "slate";
import { isKeyHotkey } from "is-hotkey";
import { KeyboardEvent } from "react";

export const onKeyDown =
  (editor: Editor) => (event: KeyboardEvent<HTMLInputElement>) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      // Default left/right behavior is unit:'character'.
      // This fails to distinguish between two cursor positions, such as
      // <inline>foo<cursor/></inline> vs <inline>foo</inline><cursor/>.
      // Here we modify the behavior to unit:'offset'.
      // This lets the user step into and out of the inline without stepping over characters.
      // You may wish to customize this further to only use unit:'offset' in specific cases.
      const { nativeEvent } = event;
      if (isKeyHotkey("left", nativeEvent)) {
        event.preventDefault();
        Transforms.move(editor, { unit: "offset", reverse: true });
        return;
      }
      if (isKeyHotkey("right", nativeEvent)) {
        event.preventDefault();
        Transforms.move(editor, { unit: "offset" });
        return;
      }
    }
  };

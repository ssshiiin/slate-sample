import { ChangeEvent, FC, useEffect, useState } from "react";
import Modal from "./Modal";
import { useSlate } from "slate-react";
import { Editor, Text } from "slate";
import { useRefModal } from "../../hooks/useRefModal";
import { RefInlineActions } from "../../modules/inline/ref";

const RefModal: FC = () => {
  const modalProps = useRefModal();
  const editor = useSlate();
  const { selection } = editor;
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    if (selection == null) return;
    const nowNode = Editor.node(editor, {
      anchor: selection.anchor,
      focus: selection.focus,
    });

    if (!Text.isText(nowNode[0])) {
      setUrl("");
      return;
    }

    setUrl(nowNode[0].text);
  }, [selection]);

  return (
    <Modal {...modalProps}>
      <div style={{ minWidth: 400, minHeight: 200 }}>
        <label>href</label>
        <Input
          value={url}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setUrl(e.target.value);
          }}
        />
      </div>
      <button
        onClick={(e) => {
          new RefInlineActions(modalProps).apply(editor, url);
          modalProps.onClose();
        }}
      >
        refタグを挿入する
      </button>
    </Modal>
  );
};

const Input: FC<{
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => {
  return <input value={value} onChange={onChange} />;
};

export default RefModal;

import { ChangeEvent, FC, Fragment, useEffect, useState } from "react";
import Modal from "./Modal";
import { useRubyModal } from "../../hooks/useRubyModal";
import { RubyInlineActions } from "../../modules/inline/ruby";
import { useSlate } from "slate-react";
import { Editor, Text } from "slate";

export type Ruby = {
  body: string;
  rt: string;
};

const RubyModal: FC = () => {
  const modalProps = useRubyModal();
  const editor = useSlate();
  const { selection } = editor;
  const [rubys, setRubys] = useState<Ruby[]>([]);

  useEffect(() => {
    if (selection == null) return;
    const nowNode = Editor.node(editor, {
      anchor: selection.anchor,
      focus: selection.focus,
    });

    if (!Text.isText(nowNode[0])) {
      setRubys([]);
      return;
    }

    setRubys([{ body: nowNode[0].text, rt: "" }]);
  }, [selection]);

  return (
    <Modal {...modalProps}>
      <div style={{ minWidth: 400, minHeight: 200 }}>
        <button
          onClick={(e) => {
            setRubys([...rubys, { body: "", rt: "" }]);
          }}
        >
          タグを増やす
        </button>
        <button
          onClick={(e) => {
            new RubyInlineActions(modalProps).apply(editor, rubys);
            modalProps.onClose();
          }}
        >
          タグを追加
        </button>
        {rubys.map((rb, index) => (
          <Fragment key={`${index}`}>
            <div>
              <label>よみ</label>
              <Input
                value={rb.rt}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const newRbs = [...rubys];
                  newRbs[index].rt = e.target.value;
                  setRubys(newRbs);
                }}
              />
            </div>
            <div>
              <label>ruby body</label>
              <Input
                value={rb.body}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const newRbs = [...rubys];
                  newRbs[index].body = e.target.value;
                  setRubys(newRbs);
                }}
              />
            </div>
          </Fragment>
        ))}
      </div>
    </Modal>
  );
};

const Input: FC<{
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => {
  return <input value={value} onChange={onChange} />;
};

export default RubyModal;

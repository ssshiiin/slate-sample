import { FC, useState } from "react";
import Editor from "./editor/Editor";
import "./App.css";
import { deserialize } from "./editor/utils/deserializer";

const App: FC = () => {
  const [value, setValue] = useState<string>(
    localStorage.getItem("value") || "",
  );
  const onChange = (value: string) => {
    setValue(value);
    localStorage.setItem("value", value);
  };
  return (
    <div>
      <Editor
        value={value}
        onChange={onChange}
        tools={["ref", "mlg", "i", "ruby", "table"]}
      />
      <h4>serialize value</h4>
      <div
        style={{ margin: "0 8px", backgroundColor: "white", color: "black" }}
      >
        <p>{value}</p>
      </div>
      <h4>deserialize value</h4>
      <div
        style={{ margin: "0 8px", backgroundColor: "white", color: "black" }}
      >
        <p>{JSON.stringify(deserialize(value))}</p>
      </div>
    </div>
  );
};

export default App;

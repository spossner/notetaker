import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import CodeMirror from "@uiw/react-codemirror";
import { type NextPage } from "next";
import { useState } from "react";

interface NoteEditorProps {
  onSave: (title: string, content: string) => void;
}
export const NoteEditor: NextPage<NoteEditorProps> = ({ onSave }) => {
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");

  return (
    <div className="card mt-5 border border-gray-500 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          <input
            type="text"
            placeholder="Note title"
            className="input-primary input input-lg w-full font-bold"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
        </h2>
        <CodeMirror
          value={code}
          onChange={(value) => setCode(value)}
          width="500px"
          height="30vh"
          minWidth="100%"
          minHeight="30vh"
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages }),
          ]}
          className="border border-gray-300"
        />
        <div className="card-actions justify-end">
          <button
            onClick={() => {
              onSave(title, code);
              setTitle("");
              setCode("");
            }}
            className="btn-primary btn"
            disabled={title.trim().length === 0 || code.trim().length === 0}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

import { type NextPage } from "next";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { type RouterOutputs } from "~/utils/api";

type Note = RouterOutputs["note"]["getAll"][0];
interface NoteCardProps {
  note: Note;
  onDelete: () => void;
}
export const NoteCard: NextPage<NoteCardProps> = ({ note, onDelete }) => {
  const [isExpanded, setExpanded] = useState(false);
  return (
    <div>
      <div className="card mt-5 border border-gray-500 bg-base-100 shadow-xl">
        <div className="card-body m-0 p-3">
          <div
            className={`collapse-arrow ${
              isExpanded ? "collapse-open" : ""
            } collapse`}
            onClick={() => setExpanded(!isExpanded)}
          >
            <div className="collapse-title text-xl font-bold">{note.title}</div>
            <div className="collapse-content">
              <article className="prose lg:prose-xl">
                <ReactMarkdown>{note.content}</ReactMarkdown>
              </article>
            </div>
          </div>
          <div className="card-actions mx-2 flex justify-end">
            <button className="btn-warning btn-xs btn px-5" onClick={onDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState, type PropsWithChildren } from "react";
import { Header } from "~/components/Header";
import { NoteCard } from "~/components/NoteCard";
import { NoteEditor } from "~/components/NoteEditor";
import { api, type RouterOutputs } from "~/utils/api";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Notetaker</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <div className="container mx-auto p-6">
          <Content />
        </div>
      </main>
    </>
  );
};

export default Home;

type Topic = RouterOutputs["topic"]["getAll"][0];
type User = RouterOutputs["topic"]["getAll"][0]["user"];
type Note = RouterOutputs["note"]["getAll"][0];
type Props = {
  user: User;
  className?: string;
  onClick?: () => void;
} & PropsWithChildren;
export const Avatar: NextPage<Props> = ({ user, className, onClick }) => {
  return (
    <div className={`text-xl font-bold ${className ?? ""}`} onClick={onClick}>
      {user.name}
    </div>
  );
};

export const Content = () => {
  const { data: sessionData } = useSession();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const { data: topics, refetch: refetchTopics } = api.topic.getAll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        console.log({ _: "getAll", data, selectedTopic });

        setSelectedTopic(selectedTopic ?? data[0] ?? null);
      },
    }
  );
  const { data: notes, refetch: refetchNotes } = api.note.getAll.useQuery(
    { topicId: selectedTopic?.id ?? "" },
    { enabled: sessionData?.user !== undefined && selectedTopic !== null }
  );
  const createTopic = api.topic.create.useMutation({
    onSuccess: () => {
      void refetchTopics();
    },
  });
  const resetTopics = api.topic.reset.useMutation({
    onSuccess: () => {
      setSelectedTopic(null);
      void refetchTopics();
    },
  });

  const createNote = api.note.create.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  const deleteNote = api.note.delete.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="">
        <div>
          {topics &&
            topics.map((t) => (
              <div
                key={t.id}
                onClick={() => void setSelectedTopic(t)}
                className={`rounded px-4 py-2 text-lg font-semibold hover:bg-sky-200 ${
                  selectedTopic && t.id === selectedTopic.id
                    ? "text-red-500"
                    : ""
                }`}
              >
                {t.title}
              </div>
            ))}
        </div>
        <button
          className="mt-4 w-full text-right font-serif text-sm italic text-neutral-400 hover:text-red-500"
          onClick={() => void resetTopics.mutate()}
        >
          Reset
        </button>
        <div className="divider mt-0"></div>
        <input
          type="text"
          placeholder="New Topic"
          className="input-bordered input input-sm w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              console.log({ _: "new topic", e });

              createTopic.mutate({ title: e.currentTarget.value });
              e.currentTarget.value = "";
            }
          }}
        ></input>
      </div>
      <div className="col-span-3">
        {notes?.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDelete={() => deleteNote.mutate({ id: note.id })}
          />
        ))}
        {!!selectedTopic && (
          <NoteEditor
            onSave={(title, content) => {
              console.log({ _: "SAVE", title, content, selectedTopic });
              createNote.mutate({
                title,
                content,
                topicId: selectedTopic.id,
              });
            }}
          />
        )}
      </div>
    </div>
  );
};

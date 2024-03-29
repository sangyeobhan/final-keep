import React, { useState, useEffect } from "react";
import InputForm from "./cards/InputForm";
import Note from "./cards/Note";

export default function Body() {
    const [noteArray, setNotes] = useState([]);

    useEffect(() => {
        fetch("/notes")
            .then((res) => res.json())
            .then((data) => {
                data = data.notes;
                setNotes(data);
            })
            .catch((e) => console.error(e));
    }, []);

    const hanleDeleteButton = (id) => {
        fetch(`/notes/${id}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then((deletedNote) => {
                const updatedNoteArray = noteArray.filter(
                    (note) => note._id !== deletedNote._id
                );

                setNotes(updatedNoteArray);
            })
            .catch((e) => console.error(e));
    };

    const addNote = (newNote) => {
        fetch("/notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newNote),
        })
            .then((res) => {
                if (res.status === 400) {
                    throw new Error("Title or content can't be empty");
                }
                return res.json();
            })
            .then((addedNote) => {
                setNotes([...noteArray, addedNote]);
            })
            .catch((e) => console.error(e));
    };

    return (
        <div className="body">
            <InputForm addNote={addNote} />
            <div className="notes-container">
                {noteArray.map((note) => {
                    return (
                        <Note
                            key={note._id}
                            note={note}
                            hanleDeleteButton={() =>
                                hanleDeleteButton(note._id)
                            }
                        />
                    );
                })}
            </div>
        </div>
    );
}

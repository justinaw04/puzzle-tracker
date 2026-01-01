"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function PuzzleModal({ user, puzzle = null, onClose, onSave }) {
  const [title, setTitle] = useState(puzzle?.title || "");
  const [pieces, setPieces] = useState(puzzle?.pieces || 0);
  const [difficulty, setDifficulty] = useState(puzzle?.difficulty || 0);
  const [enjoyment, setEnjoyment] = useState(puzzle?.enjoyment || 0);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!user) return setError("Must be logged in");
    if (!title || !pieces || !difficulty || !enjoyment) return setError("All fields required");

    setLoading(true);
    setError("");

    try {
      let imageUrl = puzzle?.image_url || "";

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError } = await supabase
          .storage.from("puzzle-images")
          .upload(fileName, imageFile);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("puzzle-images").getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      if (puzzle) {
        const { error: updateError } = await supabase
          .from("puzzles")
          .update({ title, pieces, difficulty, enjoyment, image_url: imageUrl })
          .eq("id", puzzle.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("puzzles")
          .insert({ title, pieces, difficulty, enjoyment, image_url: imageUrl, user_id: user.id, username: user.email });
        if (insertError) throw insertError;
      }

      onSave();
      onClose();
    } catch (err) {
      setError(err.message || "Error saving puzzle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 z-50">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">{puzzle ? "Edit Puzzle" : "Add Puzzle"}</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <label className="block mb-1">Title</label>
        <input className="border p-2 rounded w-full mb-2" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label className="block mb-1">Pieces</label>
        <input type="number" className="border p-2 rounded w-full mb-2" value={pieces} onChange={(e) => setPieces(Number(e.target.value))} />

        <label className="block mb-1">Difficulty (0-5)</label>
        <input type="number" min={0} max={5} className="border p-2 rounded w-full mb-2" value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value))} />

        <label className="block mb-1">Enjoyment (0-5)</label>
        <input type="number" min={0} max={5} className="border p-2 rounded w-full mb-2" value={enjoyment} onChange={(e) => setEnjoyment(Number(e.target.value))} />

        <label className="block mb-1">Image</label>
        <input type="file" accept="image/*" className="border p-2 rounded w-full mb-4" onChange={(e) => setImageFile(e.target.files[0])} />

        <button className="bg-black text-white px-4 py-2 rounded w-full" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : puzzle ? "Update Puzzle" : "Add Puzzle"}
        </button>
      </div>
    </div>
  );
}

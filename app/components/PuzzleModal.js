"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PuzzleModal({ user, puzzle, onClose, onSave }) {
  const [title, setTitle] = useState(puzzle?.title || "");
  const [pieces, setPieces] = useState(puzzle?.pieces || "");
  const [difficulty, setDifficulty] = useState(puzzle?.difficulty || 3);
  const [enjoyment, setEnjoyment] = useState(puzzle?.enjoyment || 3);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    let imageUrl = puzzle?.image_url || null;

    if (image) {
      const fileName = `${user.id}-${Date.now()}`;
      await supabase.storage.from("puzzle-images").upload(fileName, image);
      imageUrl = supabase.storage.from("puzzle-images").getPublicUrl(fileName).data.publicUrl;
    }

    if (puzzle) {
      await supabase
        .from("puzzles")
        .update({ title, pieces: Number(pieces), difficulty, enjoyment, image_url: imageUrl })
        .eq("id", puzzle.id)
        .select();
    } else {
      await supabase
        .from("puzzles")
        .insert({ user_id: user.id, username: user.email, title, pieces: Number(pieces), difficulty, enjoyment, image_url: imageUrl })
        .select();
    }

    setLoading(false);
    onClose();
    onSave(); // 🔑 update feed + stats
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 w-full max-w-md space-y-3">
        <h2 className="text-xl font-bold">{puzzle ? "Edit Puzzle" : "Add New Puzzle"}</h2>
        <input className="border p-2 w-full" value={title} onChange={e => setTitle(e.target.value)} placeholder="Puzzle Name" required />
        <input type="number" className="border p-2 w-full" value={pieces} onChange={e => setPieces(e.target.value)} placeholder="Pieces" required />
        <label>Difficulty {"⭐".repeat(difficulty)}</label>
        <input type="range" min="1" max="5" value={difficulty} onChange={e => setDifficulty(+e.target.value)} />
        <label>Enjoyment {"❤️".repeat(enjoyment)}</label>
        <input type="range" min="1" max="5" value={enjoyment} onChange={e => setEnjoyment(+e.target.value)} />
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="border px-4 py-2 rounded-xl">Cancel</button>
          <button disabled={loading} className="bg-black text-white px-4 py-2 rounded-xl">{loading ? "Saving..." : "Save"}</button>
        </div>
      </form>
    </div>
  );
}

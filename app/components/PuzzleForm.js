"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PuzzleForm({ user }) {
  const [form, setForm] = useState({
    title: "",
    pieces: "",
    difficulty: 3,
    enjoyment: 3,
    image: null,
  });

  async function submitPuzzle(e) {
    e.preventDefault();

    let imageUrl = null;

    if (form.image) {
      const fileName = `${user.id}-${Date.now()}`;
      await supabase.storage.from("puzzle-images").upload(fileName, form.image);
      imageUrl = supabase.storage
        .from("puzzle-images")
        .getPublicUrl(fileName).data.publicUrl;
    }

    await supabase.from("puzzles").insert({
      user_id: user.id,
      username: user.email,
      title: form.title,
      pieces: Number(form.pieces),
      difficulty: form.difficulty,
      enjoyment: form.enjoyment,
      image_url: imageUrl,
    });

    setForm({ title: "", pieces: "", difficulty: 3, enjoyment: 3, image: null });
  }

  return (
    <form onSubmit={submitPuzzle} className="bg-white rounded-2xl shadow p-4 mb-6 space-y-3">
      <input className="border p-2 w-full" placeholder="Puzzle name" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
      <input type="number" className="border p-2 w-full" placeholder="Pieces" value={form.pieces} onChange={e => setForm({...form, pieces: e.target.value})} />

      <label>Difficulty {"⭐".repeat(form.difficulty)}</label>
      <input type="range" min="1" max="5" value={form.difficulty} onChange={e => setForm({...form, difficulty: Number(e.target.value)})} />

      <label>Enjoyment {"❤️".repeat(form.enjoyment)}</label>
      <input type="range" min="1" max="5" value={form.enjoyment} onChange={e => setForm({...form, enjoyment: Number(e.target.value)})} />

      <input type="file" accept="image/*" onChange={e => setForm({...form, image: e.target.files[0]})} />

      <button className="bg-black text-white px-4 py-2 rounded-xl">Add Puzzle</button>
    </form>
  );
}

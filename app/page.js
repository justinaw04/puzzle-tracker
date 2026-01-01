"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AuthForm from "./components/AuthForm";
import PuzzleFeed from "./components/PuzzleFeed";
import PuzzleModal from "./components/PuzzleModal";
import Stats from "./components/Stats";

export default function Home() {
  const [user, setUser] = useState(null);
  const [puzzles, setPuzzles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    if (user) loadPuzzles();
  }, [user]);

  async function loadPuzzles() {
    const { data, error } = await supabase
      .from("puzzles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.log("Supabase error:", error);
    else setPuzzles(data || []);
  }

  if (!user) return <AuthForm />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🧩 Puzzle Tracker</h1>
        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="bg-black text-white px-4 py-2 rounded-xl"
        >
          ➕ Add Puzzle
        </button>
      </header>

      <Stats puzzles={puzzles} />

      <PuzzleFeed
        user={user}
        puzzles={puzzles}
        setPuzzles={setPuzzles}
        onEdit={p => { setEditing(p); setShowModal(true); }}
      />

      {showModal && (
        <PuzzleModal
          user={user}
          puzzle={editing}
          onClose={() => setShowModal(false)}
          onSave={loadPuzzles}
        />
      )}
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PuzzleModal from "./PuzzleModal";

export default function PuzzleFeed({ user }) {
  const [puzzles, setPuzzles] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("puzzles")
      .select("*")
      .order("created_at", { ascending: false });

    setPuzzles(data || []);
  }

  async function remove(id) {
    if (!confirm("Delete this puzzle?")) return;
    await supabase.from("puzzles").delete().eq("id", id);
    load();
  }

  return (
    <div className="space-y-4">
      {puzzles.map(p => (
        <div key={p.id} className="bg-white rounded-2xl shadow p-4">
          <div className="flex justify-between">
            <strong>{p.title}</strong>
            <span className="text-xs text-gray-400">
              {new Date(p.created_at).toLocaleDateString()}
            </span>
          </div>

          <div className="text-sm text-gray-500 mb-1">
            {p.pieces} pieces • by {p.username}
          </div>

          <div>{"⭐".repeat(p.difficulty || 0)} {"❤️".repeat(p.enjoyment || 0)}</div>

          {p.image_url && (
            <img src={p.image_url} className="rounded-xl mt-2 max-h-64" />
          )}

          {p.user_id === user.id && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setEditing(p)}
                className="border px-3 py-1 rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => remove(p.id)}
                className="border px-3 py-1 rounded-lg text-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}

      {editing && (
        <PuzzleModal
          user={user}
          puzzle={editing}
          onClose={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PuzzleFeed() {
  const [puzzles, setPuzzles] = useState([]);

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

  return (
    <div>
      {puzzles.map(p => (
        <div key={p.id} className="bg-white rounded-2xl shadow p-4 mb-4">
          <strong>{p.title}</strong> ({p.pieces} pieces)
          <div className="text-sm text-gray-500">by {p.username}</div>
          <div>{"⭐".repeat(p.difficulty || 0)} {"❤️".repeat(p.enjoyment || 0)}</div>
          {p.image_url && <img src={p.image_url} className="rounded-xl mt-2 max-h-64" />}
        </div>
      ))}
    </div>
  );
}

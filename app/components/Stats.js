"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data, error } = await supabase.from("puzzles").select("*");

    if (error || !data || data.length === 0) {
      setStats({
        total: 0,
        pieces: 0,
        avgD: 0,
        avgE: 0,
      });
      return;
    }

    const total = data.length;
    const pieces = data.reduce((s, p) => s + (p.pieces || 0), 0);
    const avgD = (
      data.reduce((s, p) => s + (p.difficulty || 0), 0) / total
    ).toFixed(1);
    const avgE = (
      data.reduce((s, p) => s + (p.enjoyment || 0), 0) / total
    ).toFixed(1);

    setStats({ total, pieces, avgD, avgE });
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card label="Puzzles" value={stats.total} />
      <Card label="Pieces" value={stats.pieces} />
      <Card label="Avg Difficulty" value={stats.avgD} />
      <Card label="Avg Enjoyment" value={stats.avgE} />
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

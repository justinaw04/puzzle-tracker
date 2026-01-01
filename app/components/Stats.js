"use client";

export default function Stats({ puzzles }) {
  const total = puzzles.length;
  const pieces = puzzles.reduce((sum, p) => sum + (p.pieces || 0), 0);
  const avgD = total === 0 ? 0 : (puzzles.reduce((s, p) => s + p.difficulty, 0) / total).toFixed(1);
  const avgE = total === 0 ? 0 : (puzzles.reduce((s, p) => s + p.enjoyment, 0) / total).toFixed(1);

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card label="Puzzles" value={total} />
      <Card label="Pieces" value={pieces} />
      <Card label="Avg Difficulty" value={avgD} />
      <Card label="Avg Enjoyment" value={avgE} />
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

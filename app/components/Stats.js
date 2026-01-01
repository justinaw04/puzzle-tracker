export default function PuzzleStats({ puzzles }) {
  if (!puzzles.length) return <p className="p-4">No puzzles match the filter.</p>;

  const totalPieces = puzzles.reduce((sum, p) => sum + p.pieces, 0);
  const avgDifficulty =
    puzzles.reduce((sum, p) => sum + p.difficulty, 0) / puzzles.length;
  const avgEnjoyment =
    puzzles.reduce((sum, p) => sum + p.enjoyment, 0) / puzzles.length;

  return (
    <div className="p-4 bg-white rounded-2xl shadow mb-4 flex flex-wrap gap-6 justify-around">
      <div className="text-center">
        <p className="text-xl font-bold">{puzzles.length}</p>
        <p className="text-gray-500">Puzzles</p>
      </div>
      <div className="text-center">
        <p className="text-xl font-bold">{totalPieces}</p>
        <p className="text-gray-500">Total Pieces</p>
      </div>
      <div className="text-center">
        <p className="text-xl font-bold">{avgDifficulty.toFixed(1)}</p>
        <p className="text-gray-500">Avg Difficulty</p>
      </div>
      <div className="text-center">
        <p className="text-xl font-bold">{avgEnjoyment.toFixed(1)}</p>
        <p className="text-gray-500">Avg Enjoyment</p>
      </div>
    </div>
  );
}

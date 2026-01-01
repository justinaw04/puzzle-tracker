export default function PuzzleStats({ puzzles }) {
  if (!puzzles || puzzles.length === 0) return null;

  // --- Time calculations
  const timesInMinutes = puzzles.map((p) => {
    if (!p.time) return 0;
    const [hours, minutes] = p.time.split(":").map(Number);
    return hours * 60 + minutes;
  });

  const totalTime = timesInMinutes.reduce((a, b) => a + b, 0);
  const avgTimeMinutes = Math.round(totalTime / puzzles.length);
  const avgHours = Math.floor(avgTimeMinutes / 60);
  const avgMinutes = avgTimeMinutes % 60;

  // --- Difficulty & enjoyment averages
  const avgDifficulty = Math.round(
    puzzles.reduce((sum, p) => sum + p.difficulty, 0) / puzzles.length
  );
  const avgEnjoyment = Math.round(
    puzzles.reduce((sum, p) => sum + p.enjoyment, 0) / puzzles.length
  );

  // --- Total pieces
  const totalPieces = puzzles.reduce((sum, p) => sum + p.pieces, 0);

  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
      <div>
        <p className="font-semibold text-gray-600">Puzzles Completed</p>
        <p className="text-xl font-bold">{puzzles.length}</p>
      </div>
      <div>
        <p className="font-semibold text-gray-600">Total Pieces</p>
        <p className="text-xl font-bold">{totalPieces}</p>
      </div>
      <div>
        <p className="font-semibold text-gray-600">Avg Difficulty</p>
        <p className="text-xl font-bold">{avgDifficulty}</p>
      </div>
      <div>
        <p className="font-semibold text-gray-600">Avg Enjoyment</p>
        <p className="text-xl font-bold">{avgEnjoyment}</p>
      </div>
      <div>
        <p className="font-semibold text-gray-600">Avg Time</p>
        <p className="text-xl font-bold">
          {avgHours.toString().padStart(2, "0")}:
          {avgMinutes.toString().padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}

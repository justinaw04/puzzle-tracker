export default function PuzzleStats({ puzzles }) {
  if (!puzzles.length) return null;

  // Convert HH:MM to minutes for averaging
  const timesInMinutes = puzzles
    .map(p => {
      if (!p.time) return 0;
      const [hours, minutes] = p.time.split(":").map(Number);
      return hours * 60 + minutes;
    });

  const totalTime = timesInMinutes.reduce((a, b) => a + b, 0);
  const avgTimeMinutes = Math.round(totalTime / puzzles.length);
  const avgHours = Math.floor(avgTimeMinutes / 60);
  const avgMinutes = avgTimeMinutes % 60;

  const avgDifficulty =
    Math.round(puzzles.reduce((a, b) => a + b.difficulty, 0) / puzzles.length);
  const avgEnjoyment =
    Math.round(puzzles.reduce((a, b) => a + b.enjoyment, 0) / puzzles.length);

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4 flex flex-col gap-2">
      <p>Total Puzzles: {puzzles.length}</p>
      <p>
        Average Difficulty: {avgDifficulty} | Average Enjoyment: {avgEnjoyment}
      </p>
      <p>
        Average Time: {avgHours.toString().padStart(2, "0")}:
        {avgMinutes.toString().padStart(2, "0")}
      </p>
    </div>
  );
}
